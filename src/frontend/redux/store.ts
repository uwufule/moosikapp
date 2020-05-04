import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import auth from './auth/reducers';
import player from './player/reducers';

const rootReducer = combineReducers({
  auth,
  player,
});

export type RootState = ReturnType<typeof rootReducer>;

const makeStore = () => createStore(rootReducer, composeWithDevTools());

export default makeStore;
