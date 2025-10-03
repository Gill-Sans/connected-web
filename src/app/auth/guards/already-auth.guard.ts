import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({ providedIn: 'root' })
export class AlreadyAuthGuard implements CanActivate {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading), // wait until session is resolved
            take(1),
            switchMap(() =>
                this.authFacade.isAuthenticated$.pipe(
                    take(1),
                    map(isAuthenticated => {
                        if (isAuthenticated) {
                            void this.router.navigate(['/']);
                            return false;
                        }
                        return true;
                    })
                )
            )
        );
    }
}
