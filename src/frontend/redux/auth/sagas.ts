import Token from '@core/models/Token';
import * as authApi from '@core/services/api/auth';
import isAccessTokenExpiresSoon from '@core/utils/isAccessTokenExpiresSoon';
import { showErrorMessage } from '@redux/modal/actions';
import { ModalActionType } from '@redux/modal/types';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { deleteToken, setToken } from './actions';
import { selectAccessToken, selectRefreshToken } from './selectors';
import { AuthActionType, LoginAction, RefreshAction, SignupAction } from './types';

function* signup(action: SignupAction) {
  try {
    yield call(authApi.signup, action.payload);

    yield put({ type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS, payload: true });
  } catch (e) {
    yield put(showErrorMessage(e.message));
  }
}

function* login(action: LoginAction) {
  try {
    const res: Token = yield call(authApi.login, action.payload.username, action.payload.password);

    yield call([localStorage, 'setItem'], 'token', res.refreshToken);
    yield put(setToken(res.accessToken, res.refreshToken));
  } catch (e) {
    yield put(showErrorMessage(e.message));
  }
}

function* refresh(action: RefreshAction) {
  try {
    const refreshToken: string = action.payload ?? (yield select(selectRefreshToken));
    const res: Token = yield call(authApi.refresh, refreshToken);

    yield call([localStorage, 'setItem'], 'token', res.refreshToken);
    yield put(setToken(res.accessToken, res.refreshToken));
  } catch (e) {
    yield put({ type: ModalActionType.SET_ERROR_MESSAGE, payload: e.message });
  }
}

function* refreshIfNeeded() {
  try {
    const accessToken: string = yield select(selectAccessToken);
    if (!accessToken) {
      return;
    }

    if (isAccessTokenExpiresSoon(accessToken)) {
      yield put({ type: AuthActionType.REFRESH });
      yield take(AuthActionType.SET_TOKEN);
    }

    yield put({ type: AuthActionType.REFRESH_IF_NEEDED_COMPLETE });
  } catch (e) {
    yield put({ type: ModalActionType.SET_ERROR_MESSAGE, message: e.message });
  }
}

function* logout() {
  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken = yield select(selectAccessToken);
  try {
    yield call(authApi.logout, accessToken);

    yield call([localStorage, 'removeItem'], 'token');
    yield put(deleteToken());
  } catch (e) {
    yield put(showErrorMessage(e.message));
  }
}

function* authSagas() {
  yield all([
    takeEvery(AuthActionType.SIGNUP, signup),
    takeEvery(AuthActionType.LOGIN, login),
    takeEvery(AuthActionType.REFRESH, refresh),
    takeEvery(AuthActionType.REFRESH_IF_NEEDED, refreshIfNeeded),
    takeEvery(AuthActionType.LOGOUT, logout),
  ]);
}

export default authSagas;
