import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserRole().pipe(
    take(1),
    map((role) => {
      if (role === 'admin') {
        return true;
      } else {
        router.navigate(['/app']);
        return false;
      }
    })
  );
};
