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

  return authService.user.pipe(
    take(1),
    map((user) => {
      const loggedIn = user ? true : false;
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
