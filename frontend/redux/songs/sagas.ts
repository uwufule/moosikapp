import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import SongData from '../../core/interfaces/SongData';
import * as songsApi from '../../core/services/api/songs';
import { pushAlert } from '../alert/actions';
import { selectAccessToken } from '../auth/selectors';
import { AuthActionType } from '../auth/types';
import * as actions from './actions';
import * as selectors from './selectors';
import { SongsActionType, SongsSources, UpdateSongAction } from './types';

function* selectSongsSource() {
  yield put(actions.clearSongList());
}

function* requestUpdateToken() {
  yield put({ type: AuthActionType.REQUEST_REFRESH });
  yield take(AuthActionType.REQUEST_REFRESH_COMPLETE);
}

function* fetchSongs() {
  const offset: number = yield select(selectors.selectSongListOffset);
  if (offset === -1) {
    return;
  }

  const source: SongsSources = yield select(selectors.selectSongsSource);
  if (!source) {
    return;
  }

  yield requestUpdateToken();
  const token: string = yield select(selectAccessToken);
  try {
    let songs: SongData[];

    switch (source.type) {
      case 'songs/all':
        songs = yield call(songsApi.getSongs, token, {
          ...source.params,
          skip: offset,
        });
        break;

      case 'songs/favorites':
        songs = yield call(songsApi.getUserFavoriteSongs, token, {
          ...source.params,
          skip: offset,
        });
        break;

      case 'songs/search':
        songs = yield call(songsApi.searchSongs, token, {
          ...source.params,
          skip: offset,
        });
        break;

      default:
        throw new Error('No request data.');
    }

    if (songs.length > 0) {
      yield put(actions.setSongListOffset(offset + songs.length));
      yield put(actions.pushSongsToSongList(songs));
    } else {
      yield put(actions.setSongListOffset(-1));
    }
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* toggleFavoriteStateForSong(token: string, songId: string, value: boolean) {
  if (value) {
    yield call(songsApi.addToFavortes, token, songId);
  } else {
    yield call(songsApi.deleteFromFavorites, token, songId);
  }
}

function* updateSong(action: UpdateSongAction) {
  yield requestUpdateToken();
  const token: string = yield select(selectAccessToken);

  try {
    const { songId, data } = action.payload;

    if (typeof data.favorite === 'boolean') {
      yield toggleFavoriteStateForSong(token, songId, data.favorite);
      return;
    }
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* songsSaga() {
  yield all([
    takeLatest(SongsActionType.SELECT_SONGS_SOURCE, selectSongsSource),
    takeLatest(SongsActionType.FETCH_SONGS, fetchSongs),
    takeEvery(SongsActionType.UPDATE_SONG, updateSong),
  ]);
}

export default songsSaga;
