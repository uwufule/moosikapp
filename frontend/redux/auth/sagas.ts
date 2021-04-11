import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { isTokenExpiresSoon } from '../../core/helpers/tokenHelper';
import Token from '../../core/interfaces/Token';
import UserData from '../../core/interfaces/UserData';
import * as authApi from '../../core/services/api/auth';
import { pushAlert } from '../alert/actions';
import * as actions from './actions';
import { selectAccessToken, selectRefreshToken } from './selectors';
import { AuthActionType, RefreshAction, SigninAction, SignupAction } from './types';
import * as usersApi from '../../core/services/api/users';

function* saveToken(token: Token) {
  yield call([localStorage, 'setItem'], 'token', token.refreshToken);
  yield put(actions.setToken(token.accessToken, token.refreshToken));
}

function* clearToken() {
  yield call([localStorage, 'removeItem'], 'token');
  yield put(actions.removeToken());
}

function* signup(action: SignupAction) {
  const { username, email, password } = action.payload;
  try {
    yield call(authApi.signup, username, email, password);
    yield put({ type: AuthActionType.SET_SIGNUP_SUCCESS_STATUS, payload: true }); // изменить
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* signin(action: SigninAction) {
  const { username, password } = action.payload;
  try {
    const token: Token = yield call(authApi.signin, username, password);
    yield saveToken(token);

    const me: UserData = yield call(usersApi.getMe, token.accessToken);
    yield put(actions.setUserData(me));
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* refresh(action: RefreshAction) {
  const refreshToken: string = action.payload ?? (yield select(selectRefreshToken));
  try {
    const token: Token = yield call(authApi.refresh, refreshToken);
    yield saveToken(token);
  } catch (e) {
    yield clearToken();
    yield put(pushAlert(e.message, 'error'));
  }
}

function* refreshIfNeeded() {
  const accessToken: string = yield select(selectAccessToken);
  if (!accessToken) {
    return;
  }

  try {
    if (isTokenExpiresSoon(accessToken)) {
      yield put(actions.refresh());
      yield take(AuthActionType.SET_TOKEN);
    }
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  } finally {
    yield put({ type: AuthActionType.REQUEST_REFRESH_COMPLETE });
  }
}

function* logout() {
  yield put({ type: AuthActionType.REQUEST_REFRESH });
  yield take(AuthActionType.REQUEST_REFRESH_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    yield call(authApi.logout, accessToken);
    yield clearToken();
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* authSagas() {
  yield all([
    takeEvery(AuthActionType.SIGNUP, signup),
    takeEvery(AuthActionType.SIGNIN, signin),
    takeEvery(AuthActionType.REFRESH, refresh),
    takeEvery(AuthActionType.REQUEST_REFRESH, refreshIfNeeded),
    takeEvery(AuthActionType.LOGOUT, logout),
  ]);
}

export default authSagas;
