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
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {
        return this.checkAuthentication(state.url);
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
        const url = `/${segments.map(segment => segment.path).join('/')}`;
        return this.checkAuthentication(url === '/' ? '/' : url);
    }

    private checkAuthentication(targetUrl: string): Observable<boolean | UrlTree> {
        const normalizedUrl = targetUrl || '/';

        return this.authFacade.isLoading$.pipe(
            filter(isLoading => !isLoading),
            take(1),
            switchMap(() => this.authFacade.isAuthenticated$.pipe(
                take(1),
                map(isAuthenticated => {
                    if (isAuthenticated) {
                        return true;
                    }

                    const publicRoutes = ['/login', '/guest', '/register', '/verify-email', '/verify'];
                    if (publicRoutes.some(route => normalizedUrl.startsWith(route))) {
                        return false;
                    }

                    return this.router.createUrlTree(['/login']);
                })
            ))
        );
    }
}
