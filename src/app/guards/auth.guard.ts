import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { map, Observable, take } from 'rxjs';

export interface CanDeactivateComponent {
  canExitFormThisRoute: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canActivateFn: CanActivateFn = ():
  | boolean
  | UrlTree
  | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use authService.currentUser$ which is the correct BehaviorSubject observable.
  return authService.currentUser$.pipe(
    // Ensure we only take the current value and immediately unsubscribe.
    take(1),
    map((user) => {
      // The user object is JwtPayload | null. It is truthy if the user is logged in.
      const loggedIn = !!user; // Use !! to convert the object/null directly to a boolean

      if (loggedIn) {
        return true;
      } else {
        return router.createUrlTree(['/signin']);
      }
    })
  );
};

// export const canActivateChildFn = () => {
//   canActivateFn();
// };

export const canDeactivateFn = (comp: CanDeactivateComponent) => {
  return comp.canExitFormThisRoute();
};
