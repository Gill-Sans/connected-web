import { Routes } from '@angular/router';
import { MainLayoutComponent } from './feature/main-layout/main-layout.component';
import { AuthGuard } from './auth/guards/auht.guard';
import { AuthLayoutComponent } from './feature/auth-layout/auth-layout.component';
import {EmailVerifiedGuard} from './auth/guards/email-verified.guard';

export const routes: Routes = [
    {
        // Authenticated routes
        path: '',
        title: 'ConnectEd - Assemble Student Teams with Ease',
        component: MainLayoutComponent,
        canActivate: [AuthGuard, EmailVerifiedGuard],
        canMatch: [AuthGuard, EmailVerifiedGuard],
        loadChildren: () => import('./feature/main-layout/main.routes').then(m => m.MAIN_ROUTES)
    },
    {
        // Unauthenticated routes
        path: '',
        component: AuthLayoutComponent,
        loadChildren: () => import('./feature/auth-layout/auth.routes').then(m => m.AUTH_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
