import {createAction, props} from '@ngrx/store';
import {User} from '../models/user.model';
import {RegistrationRequest} from '../models/registration-request.model';


export const loadSession = createAction('[Auth] Load Session');

export const loadSessionSuccess = createAction(
    '[Auth] Load Session Success',
    props<{ user: User }>()
);

export const loadSessionFailure = createAction(
    '[Auth] Load Session Failure',
    props<{ error: any }>()
);

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string }>()
);

export const loginSuccess = createAction('[Auth] Login Success');
export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());

export const register = createAction(
    '[Auth] Register',
    props<{ request: RegistrationRequest }>()
);

export const registerSuccess = createAction(
    '[Auth] Register Success',
    props<{ user: User }>()
);

export const registerFailure = createAction(
    '[Auth] Register Failure',
    props<{ error: any }>()
);

export const redirectToLogin = createAction('[Auth] Redirect To Login');

export const redirectToCanvasLogin = createAction('[Auth] Redirect To Canvas Login');
