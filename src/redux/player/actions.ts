import PlayerActions from './constants';
import { SongData, DetailedSongData } from './types';

interface SetSongsAction {
  type: PlayerActions.SET_SONG_LIST;
  payload: SongData[];
}

export const setSongs = (songs: SongData[]): SetSongsAction => ({
  type: PlayerActions.SET_SONG_LIST,
  payload: songs,
});

interface PlaySongAction {
  type: PlayerActions.PLAY_SONG;
  payload: DetailedSongData;
}

export const playSong = (song: DetailedSongData): PlaySongAction => ({
  type: PlayerActions.PLAY_SONG,
  payload: song,
});

interface SetNowPlayingAction {
  type: PlayerActions.SET_NOW_PLAYING,
  payload: number;
}

export const setNowPlaying = (index: number): SetNowPlayingAction => ({
  type: PlayerActions.SET_NOW_PLAYING,
  payload: index,
});

interface SetPausedAction {
  type: PlayerActions.SET_PAUSED;
  payload: boolean;
}

export const setPaused = (paused: boolean): SetPausedAction => ({
  type: PlayerActions.SET_PAUSED,
  payload: paused,
});

export type PlayerActionTypes = (
  SetSongsAction
  | PlaySongAction
  | SetPausedAction
  | SetNowPlayingAction
);
