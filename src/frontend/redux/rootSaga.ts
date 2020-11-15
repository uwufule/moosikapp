import { fork } from 'redux-saga/effects';
import authSagas from './auth/sagas';
import playerSagas from './player/sagas';
import songsSaga from './songs/sagas';

function* rootSaga() {
  yield fork(authSagas);
  yield fork(playerSagas);
  yield fork(songsSaga);
}

export default rootSaga;
