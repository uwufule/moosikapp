import {
  Song,
  CurrentSong,
  PlayerActionTypes,
  SetSongListAction,
  SetCurrentSongAction,
  SetCurrentSongIndexAction,
  TogglePlayingAction,
} from './types';

export const setSongList = (songs: Song[]): SetSongListAction => ({
  type: PlayerActionTypes.SET_SONG_LIST,
  payload: songs,
});

export const setCurrentSong = (song: CurrentSong): SetCurrentSongAction => ({
  type: PlayerActionTypes.SET_CURRENT_SONG,
  payload: song,
});

export const setCurrentSongIndex = (index: number): SetCurrentSongIndexAction => ({
  type: PlayerActionTypes.SET_CURRENT_SONG_INDEX,
  payload: index,
});

export const togglePlaying = (playing: boolean): TogglePlayingAction => ({
  type: PlayerActionTypes.TOGGLE_PLAYING,
  payload: playing,
});
