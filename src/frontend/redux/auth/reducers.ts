import { AuthState, AnyAuthAction, AuthActionTypes } from './types';

const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
};

const authReducer = (state = initialState, action: AnyAuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SET_TOKEN_PAIR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default authReducer;
