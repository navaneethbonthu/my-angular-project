import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canExitFormThisRoute: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};

export const canActivateChildFn = () => {
  canActivateFn();
};

export const canDeactivateFn = (comp: CanDeactivateComponent) => {
  return comp.canExitFormThisRoute();
};
