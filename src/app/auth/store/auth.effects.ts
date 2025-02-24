import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {AuthService} from '../auth.service';
import {catchError, map, mergeMap, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';


@Injectable()
export class AuthEffects {
    private readonly actions$: Actions = inject(Actions);
    private readonly router: Router = inject(Router);
    private readonly authService: AuthService = inject(AuthService);
    private readonly PLATFORM_ID: Object = inject(PLATFORM_ID);

    // Effect to load the current session by calling /auth/user
    readonly loadSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loadSession),
            mergeMap(() =>
                this.authService.getCurrentUser().pipe(
                    map(user => AuthActions.loadSessionSuccess({user})),
                    catchError(error =>
                        of(AuthActions.loadSessionFailure({error}))
                    )
                )
            )
        )
    );


    // Effect to redirect to the login page
    readonly redirectToLogin$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.redirectToLogin),
          tap(() => {
            // Only navigate if running in the browser.
            if (isPlatformBrowser(this.PLATFORM_ID)) {
              this.router.navigate(['/login']);
            } else {
              console.warn('Server-side rendering active: Skipping redirect to login.');
            }
          })
        ),
      { dispatch: false }
    );

    // Effect to redirect to the OAuth2 authorization endpoint if needed
    readonly redirectToCanvasLogin$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.redirectToCanvasLogin),
                tap(() => {
                    // Only navigate if running in the browser.
                    if (isPlatformBrowser(this.PLATFORM_ID)) {
                        window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/canvas`;
                    } else {
                        console.warn('Server-side rendering active: Skipping redirect to login.');
                    }
                })
            )
    );


}
