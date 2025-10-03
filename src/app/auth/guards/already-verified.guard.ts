import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({ providedIn: 'root' })
export class AlreadyVerifiedGuard implements CanActivate {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading),
            take(1),
            switchMap(() =>
                this.authFacade.user$.pipe(
                    take(1),
                    map(user => {
                        if (user && user.isVerified) {
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
