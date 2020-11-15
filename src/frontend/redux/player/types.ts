import Song from '@core/models/Song';
import SongDetails from '@core/models/SongDetails';
import { Action, AnyAction } from 'redux';

export type RepeatType = 'off' | 'single' | 'many';

export interface PlayerState {
  playlist: Song[];
  nowPlaying?: SongDetails;
  isPlaying: boolean;
  repeat: RepeatType;
  shuffle: boolean;
}

export enum PlayerActionType {
  SET_PLAYLIST = 'player/SET_PLAYLIST',
  PUSH_SONG_LIST_TO_PLAYLIST = 'player/PUSH_SONG_LIST_TO_PLAYLIST',
  PLAY_SONG_BY_ID = 'player/PLAY_SONG_BY_ID',
  SET_NOW_PLAYING = 'player/SET_NOW_PLAYING',
  SET_IS_PLAYING = 'player/SET_IS_PLAYING',
  SET_REPEAT = 'player/SET_REPEAT',
  SET_SHUFFLE = 'player/SET_SHUFFLE',
  PLAY_NEXT = 'player/PLAY_NEXT',
  PLAY_PREV = 'player/PLAY_PREV',
}

export interface SetPlaylistAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_PLAYLIST;
  payload: Song[];
}

export interface PushSongListToPlaylistAction extends Action<PlayerActionType> {
  type: PlayerActionType.PUSH_SONG_LIST_TO_PLAYLIST;
  payload: boolean;
}

export interface PlaySongByIdAction extends Action<PlayerActionType> {
  type: PlayerActionType.PLAY_SONG_BY_ID;
  payload: string;
}

export interface SetNowPlayingAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_NOW_PLAYING;
  payload: SongDetails;
}

export interface TogglePlayAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_IS_PLAYING;
  payload: boolean;
}

export interface SetRepeatAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_REPEAT;
  payload: RepeatType;
}

export interface SetShuffleAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_SHUFFLE;
  payload: boolean;
}

export type AnyPlayerAction =
  | SetPlaylistAction
  | PushSongListToPlaylistAction
  | PlaySongByIdAction
  | SetNowPlayingAction
  | TogglePlayAction
  | SetRepeatAction
  | SetShuffleAction
  | AnyAction;
