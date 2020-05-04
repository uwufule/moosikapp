import { AuthActionTypes, SetTokenPairAction } from './types';

export const setTokenPair = (accessToken: string, refreshToken: string): SetTokenPairAction => ({
  type: AuthActionTypes.SET_TOKEN_PAIR,
  payload: {
    accessToken,
    refreshToken,
  },
});

export const removeTokenPair = (): SetTokenPairAction => ({
  type: AuthActionTypes.SET_TOKEN_PAIR,
  payload: {
    accessToken: '',
    refreshToken: '',
  },
});
