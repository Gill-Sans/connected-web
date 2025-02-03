import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';


export const loadSession = createAction('[Auth] Load Session');

export const loadSessionSuccess = createAction(
  '[Auth] Load Session Success',
  props<{ user: User }>()
);

export const loadSessionFailure = createAction(
  '[Auth] Load Session Failure',
  props<{ error: any }>()
);

export const redirectToLogin = createAction('[Auth] Redirect To Login');

export const redirectToCanvasLogin = createAction('[Auth] Redirect To Canvas Login');
