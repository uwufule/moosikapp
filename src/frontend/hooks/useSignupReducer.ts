import React from 'react';

interface SignupInitialState {
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
}

export enum SignupActionType {
  SET_USERNAME = 'signup/SET_USERNAME',
  SET_EMAIL = 'signup/SET_EMAIL',
  SET_PASSWORD = 'signup/SET_PASSWORD',
  SET_PASSWORD_AGAIN = 'signup/SET_PASSWORD_AGAIN',
}

interface SignupAction {
  type: SignupActionType;
  payload: string;
}

const useSignupReducer = (initialState?: SignupInitialState) => {
  const signupInitialState = initialState ?? {
    username: '',
    email: '',
    password: '',
    passwordAgain: '',
  };

  const signupReducer = (state: SignupInitialState, action: SignupAction) => {
    switch (action.type) {
      case SignupActionType.SET_USERNAME:
        return { ...state, username: action.payload };
      case SignupActionType.SET_EMAIL:
        return { ...state, email: action.payload };
      case SignupActionType.SET_PASSWORD:
        return { ...state, password: action.payload };
      case SignupActionType.SET_PASSWORD_AGAIN:
        return { ...state, passwordAgain: action.payload };
      default:
        return state;
    }
  };

  return React.useReducer(signupReducer, signupInitialState);
};

export default useSignupReducer;
