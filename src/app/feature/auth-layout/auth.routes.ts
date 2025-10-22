import {Routes} from '@angular/router';
import {AlreadyAuthGuard} from '../../auth/guards/already-auth.guard';
import {AlreadyVerifiedGuard} from '../../auth/guards/already-verified.guard';

const loadLogin = () => import('../../auth/components/login/login.component').then(m => m.LoginComponent);
const loadPasswordLogin = () => import('../../auth/components/password-login/password-login.component').then(m => m.PasswordLoginComponent);
const loadRegister = () => import('../../auth/components/register/register.component').then(m => m.RegisterComponent);
const loadVerifyEmail = () => import('../verify-email/verify-email/verify-email.component').then(m => m.VerifyEmailComponent);
const loadVerifyToken = () => import('../verify-email/verify-token/verify-token.component').then(m => m.VerifyTokenComponent);

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        canActivate: [AlreadyAuthGuard],
        loadComponent: loadLogin
    },
    {
        path: 'guest',
        canActivate: [AlreadyAuthGuard],
        loadComponent: loadPasswordLogin
    },
    {
        path: 'register',
        canActivate: [AlreadyAuthGuard],
        loadComponent: loadRegister
    },
    {
        path: 'verify-email',
        canActivate: [AlreadyVerifiedGuard],
        loadComponent: loadVerifyEmail
    },
    {
        path: 'verify',
        canActivate: [AlreadyVerifiedGuard],
        loadComponent: loadVerifyToken
    }
];
