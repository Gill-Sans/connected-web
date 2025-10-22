import {Routes} from '@angular/router';
import {LoginComponent} from '../../auth/components/login/login.component';
import {PasswordLoginComponent} from '../../auth/components/password-login/password-login.component';
import {RegisterComponent} from '../../auth/components/register/register.component';
import {VerifyEmailComponent} from '../verify-email/verify-email/verify-email.component';
import {VerifyTokenComponent} from '../verify-email/verify-token/verify-token.component';
import {AlreadyAuthGuard} from '../../auth/guards/already-auth.guard';
import {AlreadyVerifiedGuard} from '../../auth/guards/already-verified.guard';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        canActivate: [AlreadyAuthGuard],
        component: LoginComponent
    },
    {
        path: 'guest',
        canActivate: [AlreadyAuthGuard],
        component: PasswordLoginComponent
    },
    {
        path: 'register',
        canActivate: [AlreadyAuthGuard],
        component: RegisterComponent
    },
    {
        path: 'verify-email',
        canActivate: [AlreadyVerifiedGuard],
        component: VerifyEmailComponent
    },
    {
        path: 'verify',
        canActivate: [AlreadyVerifiedGuard],
        component: VerifyTokenComponent
    }
];
