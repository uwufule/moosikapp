import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import login from './reducers/login';

export default () => (
  createStore(
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
