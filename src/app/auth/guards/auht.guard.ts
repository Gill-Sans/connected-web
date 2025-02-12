import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, filter, map, take, tap} from 'rxjs/operators';
import * as AuthSelectors from '../store/auth.selectors';
import {AppState} from '../models/app.state';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    private readonly store: Store<AppState> = inject(Store);
    private readonly router: Router = inject(Router);

    canActivate(): Observable<boolean> {
        // Combine isAuthenticated and loading states
        return combineLatest([
            this.store.select(AuthSelectors.selectIsAuthenticated),
            this.store.select(AuthSelectors.selectAuthLoading)
        ]).pipe(
            // Wait until the loading flag is false (i.e., session load has completed)
            filter(([_, loading]) => loading === false),
            take(1),
            tap(([isAuthenticated, _]) => {
                if (!isAuthenticated) {
                    this.router.navigate(['/login']);
                }
            }),
            map(([isAuthenticated, _]) => isAuthenticated),
            catchError(() => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}
