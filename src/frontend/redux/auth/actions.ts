import { AuthActionTypes, SetTokensAction } from './types';

export const setTokens = (accessToken: string, refreshToken: string): SetTokensAction => ({
  type: AuthActionTypes.SET_TOKENS,
  payload: {
    accessToken,
    refreshToken,
  },
});

export const removeTokens = (): SetTokensAction => ({
  type: AuthActionTypes.SET_TOKENS,
  payload: {
    accessToken: '',
    refreshToken: '',
  },
});
