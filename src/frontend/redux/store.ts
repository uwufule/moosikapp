import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import login, { LoginState, LoginAction } from './reducers/login';
import player, { PlayerState } from './player/reducers';
import { PlayerActionTypes } from './player/actions';

export interface RootState {
  login: LoginState;
  player: PlayerState;
}

type RootAction = LoginAction | PlayerActionTypes;

export default () => (
  createStore<RootState, RootAction, any, any>(
    combineReducers({
      login,
      player,
    }),
    composeWithDevTools(),
  )
);
