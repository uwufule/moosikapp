import { Action, AnyAction } from 'redux';
import UserData from '../../core/interfaces/UserData';

export interface AuthState {
  signupSuccessStatus: boolean;
  accessToken: string;
  refreshToken: string;
  me?: UserData;
}

export enum AuthActionType {
  SIGNUP = 'auth/SIGNUP',
  SIGNIN = 'auth/SIGNIN',
  REFRESH = 'auth/REFRESH',
  REQUEST_REFRESH = 'auth/REQUEST_REFRESH',
  REQUEST_REFRESH_COMPLETE = 'auth/REQUEST_REFRESH_COMPLETE',
  LOGOUT = 'auth/LOGOUT',
  SET_TOKEN = 'auth/SET_TOKEN',
  SET_ME = 'auth/SET_ME',
  SET_SIGNUP_SUCCESS_STATUS = 'auth/SET_SIGNUP_SUCCESS_STATUS',
}

export interface SignupAction extends Action<AuthActionType> {
  type: AuthActionType.SIGNUP;
  payload: {
    username: string;
    email: string;
    password: string;
  };
}

export interface SigninAction extends Action<AuthActionType> {
  type: AuthActionType.SIGNIN;
  payload: {
    username: string;
    password: string;
  };
}

export interface RefreshAction extends Action<AuthActionType> {
  type: AuthActionType.REFRESH;
  payload?: string;
}

export interface RequestRefreshAction extends Action<AuthActionType> {
  type: AuthActionType.REQUEST_REFRESH;
  payload: undefined;
}

export interface LogoutAction extends Action<AuthActionType> {
  type: AuthActionType.LOGOUT;
  payload: undefined;
}

export interface SetTokenAction extends Action<AuthActionType> {
  type: AuthActionType.SET_TOKEN;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SetUserDataAction extends Action<AuthActionType> {
  type: AuthActionType.SET_ME;
  payload: UserData;
}

export interface SetSignupSuccessStatusAction extends Action<AuthActionType> {
  type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS;
  payload: boolean;
}

export type AnyAuthAction =
  | SignupAction
  | SigninAction
  | RefreshAction
  | RequestRefreshAction
  | LogoutAction
  | SetTokenAction
  | SetUserDataAction
  | AnyAction;
