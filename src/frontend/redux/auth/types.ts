import LoginData from '@core/services/api/interfaces/LoginData';
import SignupData from '@core/services/api/interfaces/SignupData';
import { Action, AnyAction } from 'redux';

export interface AuthState {
  signupSuccessStatus: boolean;
  accessToken: string;
  refreshToken: string;
}

export enum AuthActionType {
  SIGNUP = 'auth/SIGNUP',
  SET_SIGNUP_SUCCESS_STATUS = 'auth/SET_SIGNUP_SUCCESS_STATUS',
  LOGIN = 'auth/LOGIN',
  REFRESH = 'auth/REFRESH',
  REFRESH_IF_NEEDED = 'auth/REFRESH_IF_NEEDED',
  REFRESH_IF_NEEDED_COMPLETE = 'auth/REFRESH_IF_NEEDED_COMPLETE',
  LOGOUT = 'auth/LOGOUT',
  SET_TOKEN = 'auth/SET_TOKEN',
}

export interface SignupAction extends Action<AuthActionType> {
  type: AuthActionType.SIGNUP;
  payload: SignupData;
}

export interface SetSignupSuccessStatusAction extends Action<AuthActionType> {
  type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS;
  payload: boolean;
}

export interface LoginAction extends Action<AuthActionType> {
  type: AuthActionType.LOGIN;
  payload: LoginData;
}

export interface RefreshAction extends Action<AuthActionType> {
  type: AuthActionType.REFRESH;
  payload?: string;
}

export interface RefreshIfNeededAction extends Action<AuthActionType> {
  type: AuthActionType.REFRESH_IF_NEEDED;
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

export type AnyAuthAction =
  | SignupAction
  | LoginAction
  | RefreshAction
  | RefreshIfNeededAction
  | LogoutAction
  | SetTokenAction
  | AnyAction;
