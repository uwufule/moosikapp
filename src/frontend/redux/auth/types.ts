export interface AuthState {
  accessToken: string;
  refreshToken: string;
}

export enum AuthActionTypes {
  SET_TOKEN_PAIR = 'SET_TOKEN_PAIR',
}

export interface SetTokenPairAction {
  type: AuthActionTypes.SET_TOKEN_PAIR;
  payload: AuthState;
}

export type AnyAuthAction = SetTokenPairAction;
