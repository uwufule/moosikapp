import { MakeStore } from 'next-redux-wrapper';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import auth from './auth/reducers';
import modal from './modal/reducers';
import player from './player/reducers';

const rootReducer = combineReducers({
  auth,
  player,
  modal,
});

export type RootState = ReturnType<typeof rootReducer>;

const makeStore: MakeStore = () => createStore(rootReducer, composeWithDevTools());

export default makeStore;
