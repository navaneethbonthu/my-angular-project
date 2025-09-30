import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { exhaustMap, take } from 'rxjs'; // Using exhaustMap as requested

const isPublicEndpoint = (url: string): boolean => {
  const publicPaths = ['/auth/login', '/auth/signup'];
  return publicPaths.some((path) => url.includes(path));
};

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  if (isPublicEndpoint(req.url)) {
    console.log(`Interceptor: Skipping token for public route: ${req.url}`);
    return next(req);
  }

  return authService.currentUser$.pipe(
    take(1),
    exhaustMap(() => {
      const token = authService.getToken();

      if (!token) {
        console.log(
          `Interceptor: No token found for protected route: ${req.url}`
        );
        return next(req);
      }

      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        `Interceptor: Attaching token as query param 'auth' to protected route: ${req.url}`
      );
      return next(clonedRequest);
    })
  );
};
