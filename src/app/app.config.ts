import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideMarkdown} from 'ngx-markdown';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';

import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {authReducer} from './auth/store/auth.reducer';
import {AuthEffects} from './auth/store/auth.effects';
import {authInterceptor} from './auth/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideStore({auth: authReducer}),
        provideEffects([AuthEffects]),
        provideMarkdown(),
    ]
};
