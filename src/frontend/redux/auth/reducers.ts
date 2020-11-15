import { AnyAuthAction, AuthActionType, AuthState } from './types';

const initialState: AuthState = {
  signupSuccessStatus: false,
  accessToken: '',
  refreshToken: '',
};

const authReducer = (state = initialState, action: AnyAuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.SET_TOKEN:
      return { ...state, ...action.payload };
    case AuthActionType.SET_SIGNUP_SUCCESS_STATUS:
      return { ...state, signupSuccessStatus: action.payload };
    default:
      return state;
  }
};

export default authReducer;
