import LoginData from '@core/services/api/interfaces/LoginData';
import SignupData from '@core/services/api/interfaces/SignupData';
import {
  AuthActionType,
  LoginAction,
  LogoutAction,
  RefreshAction,
  SetSignupSuccessStatusAction,
  SetTokenAction,
  SignupAction,
} from './types';

export const signup = (data: SignupData): SignupAction => ({
  type: AuthActionType.SIGNUP,
  payload: data,
});

export const resetSignupSuccessStatus = (): SetSignupSuccessStatusAction => ({
  type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS,
  payload: false,
});

export const login = (data: LoginData): LoginAction => ({
  type: AuthActionType.LOGIN,
  payload: data,
});

export const refresh = (refreshToken?: string): RefreshAction => ({
  type: AuthActionType.REFRESH,
  payload: refreshToken,
});

export const logout = (): LogoutAction => ({
  type: AuthActionType.LOGOUT,
  payload: undefined,
});

export const setToken = (accessToken: string, refreshToken: string): SetTokenAction => ({
  type: AuthActionType.SET_TOKEN,
  payload: {
    accessToken,
    refreshToken,
  },
});

export const deleteToken = (): SetTokenAction => ({
  type: AuthActionType.SET_TOKEN,
  payload: {
    accessToken: '',
    refreshToken: '',
  },
});
