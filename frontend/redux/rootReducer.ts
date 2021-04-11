import { combineReducers } from 'redux';
import alert from './alert/reducer';
import auth from './auth/reducer';
import player from './player/reducers';
import sidebar from './sidebar/reducer';
import songs from './songs/reducers';

const rootReducer = combineReducers({
  alert,
  auth,
  player,
  sidebar,
  songs,
});

export default rootReducer;
