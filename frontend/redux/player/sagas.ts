import shuffle from 'lodash/shuffle';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { Maybe } from 'yup/lib/types';
import DetailedSongData from '../../core/interfaces/DetailedSongData';
import SongData from '../../core/interfaces/SongData';
import * as songsApi from '../../core/services/api/songs';
import { pushAlert } from '../alert/actions';
import { selectAccessToken } from '../auth/selectors';
import { AuthActionType } from '../auth/types';
import { fetchSongs, setFavoriteSongsSource } from '../songs/actions';
import { selectSongList } from '../songs/selectors';
import { SongsActionType } from '../songs/types';
import * as actions from './actions';
import { selectCurrentSong, selectPlaylist } from './selectors';
import { PlayerActionType, PlaySongByIdAction, SetShuffleAction } from './types';

function* requestUpdateToken() {
  yield put({ type: AuthActionType.REQUEST_REFRESH });
  yield take(AuthActionType.REQUEST_REFRESH_COMPLETE);
}

function* requestFavoriteSongs() {
  yield put(setFavoriteSongsSource({ skip: 0, scope: 2 }));
  yield put(fetchSongs());
}

function* copySongListToPlaylist() {
  let songList: SongData[] = yield select(selectSongList);
  if (songList.length === 0) {
    yield requestFavoriteSongs();
    yield take(SongsActionType.PUSH_SONGS_TO_SONG_LIST);

    songList = yield select(selectSongList);
  }

  if (songList.length > 0) {
    yield put(actions.setPlaylist(songList));
  }

  return songList;
}

function* playSongById(action: PlaySongByIdAction) {
  yield requestUpdateToken();
  const token: string = yield select(selectAccessToken);

  try {
    const song: DetailedSongData = yield call(songsApi.getSongById, token, action.payload);
    yield put(actions.setCurrentSong(song));

    yield put(actions.setPlaying(true));
  } catch (e) {
    yield put(pushAlert(e.message, 'error'));
  }
}

function* play() {
  const currentSong: Maybe<DetailedSongData> = yield select(selectCurrentSong);
  if (currentSong) {
    yield put(actions.setPlaying(true));
    return;
  }

  let playlist: SongData[] = yield select(selectPlaylist);
  if (playlist.length === 0) {
    playlist = yield copySongListToPlaylist();
  }

  const songId = playlist[0]?.id;
  if (songId) {
    yield put(actions.playSongById(songId));
  }
}

function* playPrev() {
  const playlist: SongData[] = yield select(selectPlaylist);

  const currentSong: Maybe<DetailedSongData> = yield select(selectCurrentSong);
  const currentSongIndex = playlist.findIndex((s) => s.id === currentSong?.id);

  const prevSong = playlist?.[currentSongIndex - 1];
  if (prevSong) {
    yield put(actions.playSongById(prevSong.id));
  }
}

function* playNext() {
  let playlist: SongData[] = yield select(selectPlaylist);
  if (playlist.length === 0) {
    playlist = yield copySongListToPlaylist();
  }

  const currentSong: Maybe<DetailedSongData> = yield select(selectCurrentSong);
  const currentSongIndex = playlist.findIndex((s) => s.id === currentSong?.id);

  const nextSong = playlist[currentSongIndex + 1];

  if (nextSong) {
    yield put(actions.playSongById(nextSong.id));
  }
}

function* shufflePlaylist(action: SetShuffleAction) {
  if (action.payload) {
    const playlist: SongData[] = yield select(selectPlaylist);

    yield put(actions.clearPlaylist());
    yield put(actions.setPlaylist(shuffle(playlist)));
    return;
  }

  yield put(actions.clearPlaylist());
  yield put(actions.copySongListToPlaylist());
}

function* playerSaga() {
  yield all([
    takeEvery(PlayerActionType.COPY_SONG_LIST_TO_PLAYLIST, copySongListToPlaylist),
    takeLatest(PlayerActionType.PLAY_SONG_BY_ID, playSongById),
    takeEvery(PlayerActionType.PLAY, play),
    takeEvery(PlayerActionType.PLAY_PREV, playPrev),
    takeEvery(PlayerActionType.PLAY_NEXT, playNext),
    takeEvery(PlayerActionType.SET_SHUFFLE, shufflePlaylist),
  ]);
}

export default playerSaga;
