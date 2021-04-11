import { AppState } from '../types';

export const selectIsAuthorized = (state: AppState) => !!state.auth.accessToken;

export const selectAccessToken = (state: AppState) => state.auth.accessToken;

export const selectRefreshToken = (state: AppState) => state.auth.refreshToken;

export const selectSignupSuccessStatus = (state: AppState) => state.auth.signupSuccessStatus;

export const selectUserData = (state: AppState) => state.auth.me;
