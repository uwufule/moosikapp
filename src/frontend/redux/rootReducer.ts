import { combineReducers } from 'redux';
import auth from './auth/reducers';
import modal from './modal/reducers';
import player from './player/reducers';
import songs from './songs/reducers';

const rootReducer = combineReducers({ auth, modal, player, songs });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
