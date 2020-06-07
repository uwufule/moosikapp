export interface AuthState {
  accessToken: string;
  refreshToken: string;
}

export enum AuthActionTypes {
  SET_TOKENS = 'set_tokens',
}

export interface SetTokensAction {
  type: AuthActionTypes.SET_TOKENS;
  payload: AuthState;
}

export type AnyAuthAction = SetTokensAction;
