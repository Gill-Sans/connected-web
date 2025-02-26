import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as AuthActions from './auth.actions'; // Actions like loadSession, redirectToLogin, logout
import * as AuthSelectors from './auth.selectors';
import {filter, take} from 'rxjs/operators';
import {firstValueFrom, map} from 'rxjs';
import {RegistrationRequest} from '../models/registration-request.model'; // Selectors like selectUser, selectIsAuthenticated, etc.

@Injectable({providedIn: 'root'})
export class AuthFacade {
    // Using the new inject() function for a cleaner injection
    private readonly store = inject(Store);

    // Expose authentication state from the store
    readonly user$ = this.store.select(AuthSelectors.selectUser);
    readonly isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
    readonly isLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
    readonly authError$ = this.store.select(AuthSelectors.selectAuthError);

    // Dispatch an action to load the current session (calls /auth/user behind the scenes)
    loadSession(): Promise<void> {
        this.store.dispatch(AuthActions.loadSession());
        return firstValueFrom(
            this.isLoading$.pipe(
                filter(loading => !loading),
                take(1),
                map(() => undefined)
            )
        );
    }

    // Dispatch an action that triggers a redirect to the OAuth2 authorization endpoint
    redirectToLogin(): void {
        this.store.dispatch(AuthActions.redirectToLogin());
    }

    redirectToCanvasLogin(): void {
        this.store.dispatch(AuthActions.redirectToCanvasLogin());
    }

    login(username: string, password: string): void {
        this.store.dispatch(AuthActions.login({ username, password }));
    }

    register(request: RegistrationRequest): void {
        this.store.dispatch(AuthActions.register({ request }));
    }

    // TODO: Implement logout functionality
    // logout(): void {
    //   this.store.dispatch(AuthActions.logout());
    // }
}
