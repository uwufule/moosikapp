export interface Song {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export interface CurrentSong extends Song {
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface PlayerState {
  songList: Song[];
  current: {
    song: CurrentSong | null;
    index: number;
  };
  playing: boolean;
}

export enum PlayerActionTypes {
  SET_SONG_LIST = 'set_song_list',
  SET_CURRENT_SONG = 'set_current_song',
  SET_CURRENT_SONG_INDEX = 'set_current_song_index',
  TOGGLE_PLAYING = 'toggle_playing',
}

export interface SetSongListAction {
  type: PlayerActionTypes.SET_SONG_LIST;
  payload: Song[];
}

export interface SetCurrentSongAction {
  type: PlayerActionTypes.SET_CURRENT_SONG;
  payload: CurrentSong;
}

export interface SetCurrentSongIndexAction {
  type: PlayerActionTypes.SET_CURRENT_SONG_INDEX;
  payload: number;
}

export interface TogglePlayingAction {
  type: PlayerActionTypes.TOGGLE_PLAYING,
  payload: boolean,
}

export type AnyPlayerAction = (
  SetSongListAction
  | SetCurrentSongAction
  | SetCurrentSongIndexAction
  | TogglePlayingAction
);
