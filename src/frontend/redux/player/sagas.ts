import Song from '@core/models/Song';
import SongDetails from '@core/models/SongDetails';
import { selectSongList, selectSongsRetrieveStatus } from '@redux/songs/selectors';
import { SongsActionType } from '@redux/songs/types';
import { all, put, select, take, takeEvery } from 'redux-saga/effects';
import { selectNowPlaying, selectPlaylist, selectRepeat } from './selectors';
import {
  PlayerActionType,
  PlaySongByIdAction,
  PushSongListToPlaylistAction,
  RepeatType,
} from './types';

function* pushSongListToPlaylist(action: PushSongListToPlaylistAction) {
  const status: boolean = yield select(selectSongsRetrieveStatus);
  if (!status) {
    yield put({ type: SongsActionType.FETCH_FAVORITES, payload: { skip: 0 } });
    yield take(SongsActionType.SET_SONG_LIST);
  }

  const songList: Song[] = yield select(selectSongList);
  yield put({ type: PlayerActionType.SET_PLAYLIST, payload: songList });

  if (action.payload) {
    yield put({
      type: PlayerActionType.PLAY_SONG_BY_ID,
      payload: songList[0].id,
    });
  }
}

function* playSongById(action: PlaySongByIdAction) {
  yield put({ type: SongsActionType.FETCH_SONG_BY_ID, payload: action.payload });
  yield take(PlayerActionType.SET_NOW_PLAYING);
  yield put({ type: PlayerActionType.SET_IS_PLAYING, payload: true });
}

function* playPrev() {
  const playlist: Song[] = yield select(selectPlaylist);
  const nowPaying: SongDetails = yield select(selectNowPlaying);

  const songIndex = playlist.findIndex((song) => song.id === nowPaying?.id);
  const prevSongIndex = songIndex - 1;

  if (prevSongIndex >= 0) {
    const songId = playlist[prevSongIndex].id;
    yield put({ type: PlayerActionType.PLAY_SONG_BY_ID, payload: songId });
  }
}

function* playNext() {
  const playlist: Song[] = yield select(selectPlaylist);
  const nowPaying: SongDetails = yield select(selectNowPlaying);

  const songIndex = playlist.findIndex((song) => song.id === nowPaying?.id);
  const nextSongIndex = songIndex + 1;

  if (nextSongIndex < playlist.length) {
    const songId = playlist[nextSongIndex].id;
    yield put({ type: PlayerActionType.PLAY_SONG_BY_ID, payload: songId });
    return;
  }

  const repeat: RepeatType = yield select(selectRepeat);
  if (repeat === 'many') {
    yield put({ type: SongsActionType.FETCH_SONG_BY_ID, payload: playlist[0].id });
  }
}

function* playerSaga() {
  yield all([
    takeEvery(PlayerActionType.PUSH_SONG_LIST_TO_PLAYLIST, pushSongListToPlaylist),
    takeEvery(PlayerActionType.PLAY_SONG_BY_ID, playSongById),
    takeEvery(PlayerActionType.PLAY_PREV, playPrev),
    takeEvery(PlayerActionType.PLAY_NEXT, playNext),
  ]);
}

export default playerSaga;
