import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import login, { LoginState, LoginAction } from './reducers/login';

export interface RootState {
  login: LoginState;
}

type RootAction = LoginAction;

export default () => (
  createStore<RootState, RootAction, any, any>(
    combineReducers({
      login,
    }),
    composeWithDevTools(
      applyMiddleware(
        thunkMiddleware,
      ),
    ),
  )
);
