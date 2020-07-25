export interface Song {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export interface SongDetails extends Song {
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export type RepeatTypes = 'single' | 'many' | 'off';

export interface PlayerState {
  songList: Song[];
  current: {
    song: SongDetails | null;
    index: number;
  };
  playing: boolean;
  repeat: RepeatTypes;
  shuffle: boolean;
}

export enum PlayerActionTypes {
  SET_SONG_LIST = 'set_song_list',
  SET_CURRENT_SONG = 'set_current_song',
  SET_CURRENT_SONG_INDEX = 'set_current_song_index',
  SET_PLAYING = 'set_playing',
  SET_REPEAT = 'set_repeat',
  SET_SHUFFLE = 'set_shuffle',
}

export interface SetSongListAction {
  type: PlayerActionTypes.SET_SONG_LIST;
  payload: Song[];
}

export interface SetCurrentSongAction {
  type: PlayerActionTypes.SET_CURRENT_SONG;
  payload: SongDetails;
}

export interface SetCurrentSongIndexAction {
  type: PlayerActionTypes.SET_CURRENT_SONG_INDEX;
  payload: number;
}

export interface SetPlayingAction {
  type: PlayerActionTypes.SET_PLAYING;
  payload: boolean;
}

export interface SetRepeatAction {
  type: PlayerActionTypes.SET_REPEAT;
  payload: RepeatTypes;
}

export interface SetShuffleAction {
  type: PlayerActionTypes.SET_SHUFFLE;
  payload: boolean;
}

export type AnyPlayerAction =
  | SetSongListAction
  | SetCurrentSongAction
  | SetCurrentSongIndexAction
  | SetPlayingAction
  | SetRepeatAction
  | SetShuffleAction;
