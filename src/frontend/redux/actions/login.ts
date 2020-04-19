import Constants from '../constants/login';

export const setTokenChain = (accessToken: string, refreshToken: string) => ({
  type: Constants.SET_TOKEN_CHAIN,
  payload: {
    accessToken,
    refreshToken,
  },
});

export const clearTokenChain = () => ({
  type: Constants.SET_TOKEN_CHAIN,
  payload: {
    accessToken: '',
    refreshToken: '',
  },
});
