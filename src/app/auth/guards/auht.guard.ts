import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        // Wait until the initial session loading is complete
        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading), // Wait for the loading to finish
            take(1), // We only need the first value after loading is done
            switchMap(() => {
                // Now that we know the state is resolved, check for authentication
                return this.authFacade.isAuthenticated$.pipe(
                    take(1),
                    map(isAuthenticated => {
                        if (isAuthenticated) {
                            return true; // User is authenticated, allow access.
                        } else {
                            // User is not authenticated, redirect to the login page.
                            void this.router.navigate(['/login']);
                            return false;
                        }
                    })
                );
            })
        );
    }
}
