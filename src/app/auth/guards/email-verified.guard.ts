import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanMatch,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate, CanMatch {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {
        return this.checkVerification(state.url);
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
        const url = `/${segments.map(segment => segment.path).join('/')}`;
        return this.checkVerification(url || '/');
    }

    private checkVerification(targetUrl: string): Observable<boolean | UrlTree> {
        const normalizedUrl = targetUrl || '/';

        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading),
            take(1),
            switchMap(() => this.authFacade.user$.pipe(
                take(1),
                map(user => {
                    if (!user) {
                        return this.router.createUrlTree(['/login']);
                    }

                    if (user.isVerified) {
                        return true;
                    }

                    if (normalizedUrl.startsWith('/verify-email') || normalizedUrl.startsWith('/verify')) {
                        return true;
                    }

                    return this.router.createUrlTree(['/verify-email']);
                })
            ))
        );
    }
}
