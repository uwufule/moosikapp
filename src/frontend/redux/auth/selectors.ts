import { RootState } from '@redux/rootReducer';

export const selectSignupSuccessStatus = (state: RootState) => state.auth.signupSuccessStatus;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectIsLoggedIn = (state: RootState) => !!state.auth.accessToken;
