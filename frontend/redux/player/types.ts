import { Action } from 'redux';
import { Maybe } from 'yup/lib/types';
import DetailedSongData from '../../core/interfaces/DetailedSongData';
import SongData from '../../core/interfaces/SongData';

export type RepeatType = 'off' | 'single' | 'playlist';

export interface PlayerState {
  playlist: SongData[];
  currentSong: Maybe<DetailedSongData>;
  playing: boolean;
  repeat: RepeatType;
  shuffle: boolean;
}

export enum PlayerActionType {
  PLAY = 'player/PLAY',
  PLAY_PREV = 'player/PLAY_PREV',
  PLAY_NEXT = 'player/PLAY_NEXT',
  PAUSE = 'player/PAUSE',
  CLEAR_PLAYLIST = 'player/CLEAR_PLAYLIST',
  COPY_SONG_LIST_TO_PLAYLIST = 'player/COPY_SONG_LIST_TO_PLAYLIST',
  SET_PLAYLIST = 'player/SET_PLAYLIST',
  SET_CURRENT_SONG = 'player/SET_CURRENT_SONG',
  PLAY_SONG_BY_ID = 'player/PLAY_SONG_BY_ID',
  SET_PLAYING = 'player/SET_PLAYNG',
  SET_REPEAT = 'player/SET_REPEAT',
  SET_SHUFFLE = 'player/SET_SHUFFLE',
}

export interface ClearPlaylistAction extends Action<PlayerActionType> {
  type: PlayerActionType.CLEAR_PLAYLIST;
}

export interface CopySongsToPlaylistAction extends Action<PlayerActionType> {
  type: PlayerActionType.COPY_SONG_LIST_TO_PLAYLIST;
}

export interface SetPlaylistAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_PLAYLIST;
  payload: SongData[];
}

export interface PlaySongByIdAction extends Action<PlayerActionType> {
  type: PlayerActionType.PLAY_SONG_BY_ID;
  payload: string;
}

export interface SetCurrentSongAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_CURRENT_SONG;
  payload: DetailedSongData;
}

export interface PlayAction extends Action<PlayerActionType> {
  type: PlayerActionType.PLAY;
}

export interface PlayPrevAction extends Action<PlayerActionType> {
  type: PlayerActionType.PLAY_PREV;
}

export interface PlayNextAction extends Action<PlayerActionType> {
  type: PlayerActionType.PLAY_NEXT;
}

export interface PauseAction extends Action<PlayerActionType> {
  type: PlayerActionType.PAUSE;
}

export interface SetPlayingAction extends Action<PlayerActionType> {
  type: PlayerActionType.SET_PLAYING;
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
  | ClearPlaylistAction
  | CopySongsToPlaylistAction
  | SetPlaylistAction
  | SetCurrentSongAction
  | PauseAction
  | SetPlayingAction
  | SetRepeatAction
  | SetShuffleAction;
