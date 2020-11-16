import Song from '@core/models/Song';
import SongDetails from '@core/models/SongDetails';
import * as songsApi from '@core/services/api/songs';
import { selectAccessToken } from '@redux/auth/selectors';
import { AuthActionType } from '@redux/auth/types';
import { showErrorMessage } from '@redux/modal/actions';
import { PlayerActionType } from '@redux/player/types';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { LIMIT } from './helpers/constants';
import updateNext from './helpers/updateNext';
import {
  FetchFavoritesAction,
  FetchSongByIdAction,
  FetchSongsAction,
  SearchSongsAction,
  SongsActionType,
  ToggleFavoriteStateForSongAction,
} from './types';

function* fetchSongs(action: FetchSongsAction) {
  const skip: number = yield updateNext(action.payload.skip);
  if (skip === -1) {
    return;
  }

  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    const songs: Song[] = yield call(songsApi.getSongs, accessToken, {
      skip,
      limit: LIMIT,
      ...action.payload,
    });

    if (skip > 0) {
      yield put({ type: SongsActionType.APPEND_SONG_LIST, payload: songs });
    } else {
      yield put({ type: SongsActionType.SET_SONG_LIST, payload: songs });
    }
  } catch (e) {
    yield put({ type: SongsActionType.SET_SONG_LIST, payload: [] });
    yield put(showErrorMessage(e.message));
  }
}

function* fetchFavorites(action: FetchFavoritesAction) {
  const skip: number = yield updateNext(action.payload.skip);
  if (skip === -1) {
    return;
  }

  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    const songs: Song[] = yield call(songsApi.getFavoriteSongs, accessToken, {
      skip,
      limit: LIMIT,
      ...action.payload,
    });

    if (skip > 0) {
      yield put({ type: SongsActionType.APPEND_SONG_LIST, payload: songs });
    } else {
      yield put({ type: SongsActionType.SET_SONG_LIST, payload: songs });
    }
  } catch (e) {
    yield put({ type: SongsActionType.SET_SONG_LIST, payload: [] });
    yield put(showErrorMessage(e.message));
  }
}

function* searchSongs(action: SearchSongsAction) {
  const skip: number = yield updateNext(action.payload.skip);
  if (skip === -1) {
    return;
  }

  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    const songs: Song[] = yield call(songsApi.searchSongs, accessToken, {
      skip,
      limit: LIMIT,
      ...action.payload,
    });

    if (skip > 0) {
      yield put({ type: SongsActionType.APPEND_SONG_LIST, payload: songs });
    } else {
      yield put({ type: SongsActionType.SET_SONG_LIST, payload: songs });
    }
  } catch (e) {
    yield put({ type: SongsActionType.SET_SONG_LIST, payload: [] });
    yield put(showErrorMessage(e.message));
  }
}

function* fetchSongById(action: FetchSongByIdAction) {
  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    const song: SongDetails = yield call(songsApi.getSongById, accessToken, action.payload);
    yield put({ type: PlayerActionType.SET_NOW_PLAYING, payload: song });
    // yield put({ type: PlayerActionType.SET_IS_PLAYING, payload: true });
  } catch (e) {
    yield put(showErrorMessage(e.message));
  }
}

function* toggleFavoriteStateForSong(action: ToggleFavoriteStateForSongAction) {
  yield put({ type: AuthActionType.REFRESH_IF_NEEDED });
  yield take(AuthActionType.REFRESH_IF_NEEDED_COMPLETE);

  const accessToken: string = yield select(selectAccessToken);
  try {
    const { songId, value } = action.payload;

    if (value) {
      yield call(songsApi.addToFavortes, accessToken, songId);
    } else {
      yield call(songsApi.deleteFromFavorites, accessToken, songId);
    }
  } catch (e) {
    yield put(showErrorMessage(e.message));
  }
}

function* songsSaga() {
  yield all([
    takeLatest(SongsActionType.FETCH_SONGS, fetchSongs),
    takeLatest(SongsActionType.FETCH_FAVORITES, fetchFavorites),
    takeLatest(SongsActionType.SEARCH_SONGS, searchSongs),
    takeLatest(SongsActionType.FETCH_SONG_BY_ID, fetchSongById),
    takeEvery(SongsActionType.TOGGLE_FAVORITE_STATE_FOR_SONG, toggleFavoriteStateForSong),
  ]);
}

export default songsSaga;
