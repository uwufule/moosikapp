import { Action, Reducer } from 'redux';
import Constants from '../constants/login';

export interface LoginState {
  accessToken: string;
  refreshToken: string;
}

export interface LoginAction extends Action {
  type: Constants;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}

const initialState: LoginState = {
  accessToken: '',
  refreshToken: '',
};

const loginReducer: Reducer<LoginState, LoginAction> = (
  state = initialState,
  action: LoginAction,
) => {
  switch (action.type) {
    case Constants.SET_TOKEN_CHAIN:
      return {
        ...state, ...action.payload,
      };
    default:
      return state;
  }
};

export default loginReducer;
