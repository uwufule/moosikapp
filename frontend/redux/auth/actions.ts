import UserData from '../../core/interfaces/UserData';
import {
  AuthActionType,
  LogoutAction,
  RefreshAction,
  SetSignupSuccessStatusAction,
  SetTokenAction,
  SetUserDataAction,
  SigninAction,
  SignupAction,
} from './types';

export const signup = (username: string, email: string, password: string): SignupAction => ({
  type: AuthActionType.SIGNUP,
  payload: { username, email, password },
});

export const signin = (username: string, password: string): SigninAction => ({
  type: AuthActionType.SIGNIN,
  payload: { username, password },
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

export const removeToken = (): SetTokenAction => ({
  type: AuthActionType.SET_TOKEN,
  payload: {
    accessToken: '',
    refreshToken: '',
  },
});

export const setUserData = (userData: UserData): SetUserDataAction => ({
  type: AuthActionType.SET_ME,
  payload: userData,
});

export const resetSignupSuccessStatus = (): SetSignupSuccessStatusAction => ({
  type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS,
  payload: false,
});
