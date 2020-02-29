import { AnyAction } from 'redux';
import LoginConstants from '../constants/login';

export interface LoginAction extends AnyAction {
  type: LoginConstants;
  payload: any;
}

const initialState = {
  token: null,
  refreshToken: null,
};

export default (state = initialState, action: LoginAction) => {
  switch (action.type) {
    case LoginConstants.SET_REFRESH_TOKEN:
      return {
        ...state, refreshToken: action.payload,
      };
    default:
      return state;
  }
};
