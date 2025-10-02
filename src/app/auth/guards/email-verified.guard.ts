import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        // Wait for the session loading to finish before checking the user's status
        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading),
            take(1),
            switchMap(() => {
                // AuthGuard has already run, so we can assume a user object exists.
                // Now, just check the verification status.
                return this.authFacade.user$.pipe(
                    take(1),
                    map(user => {
                        if (user && user.isVerified) {
                            return true; // User is verified, allow access.
                        } else {
                            // User is not verified, redirect to the verification page.
                            void this.router.navigate(['/verify-email']);
                            return false;
                        }
                    })
                );
            })
        );
    }
}
