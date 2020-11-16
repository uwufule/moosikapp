import { put, select } from 'redux-saga/effects';
import { selectNext } from '../selectors';
import { SongsActionType } from '../types';
import { LIMIT } from './constants';

function* updateNext(initValue?: number) {
  const next: number = initValue ?? (yield select(selectNext));
  if (next === -1) {
    return -1;
  }

  if (next !== 0 && next % LIMIT !== 0) {
    yield put({ type: SongsActionType.SET_NEXT, payload: -1 });
    return -1;
  }

  return next;
}

export default updateNext;
