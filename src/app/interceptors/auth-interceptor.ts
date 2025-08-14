import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { exhaustMap, take } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  return authService.user.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user || !user.token) {
        return next(req);
      }
      const clonedRequest = req.clone({
        params: new HttpParams().set('auth', user.token),
      });
      return next(clonedRequest);
    })
  );
};
