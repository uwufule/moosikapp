import {
  Song,
  SongDetails,
  PlayerActionTypes,
  SetSongListAction,
  SetCurrentSongAction,
  SetCurrentSongIndexAction,
  SetPlayingAction,
  SetShuffleAction,
  RepeatTypes,
  SetRepeatAction,
  SetFavAction,
} from './types';

export const setSongList = (songs: Song[]): SetSongListAction => ({
  type: PlayerActionTypes.SET_SONG_LIST,
  payload: songs,
});

export const setCurrentSong = (song: SongDetails): SetCurrentSongAction => ({
  type: PlayerActionTypes.SET_CURRENT_SONG,
  payload: song,
});

export const setCurrentSongIndex = (index: number): SetCurrentSongIndexAction => ({
  type: PlayerActionTypes.SET_CURRENT_SONG_INDEX,
  payload: index,
});

export const setPlaying = (playing: boolean): SetPlayingAction => ({
  type: PlayerActionTypes.SET_PLAYING,
  payload: playing,
});

export const setRepeat = (repeat: RepeatTypes): SetRepeatAction => ({
  type: PlayerActionTypes.SET_REPEAT,
  payload: repeat,
});

export const setShuffle = (shuffle: boolean): SetShuffleAction => ({
  type: PlayerActionTypes.SET_SHUFFLE,
  payload: shuffle,
});

export const setFav = (songId: string, value: boolean): SetFavAction => ({
  type: PlayerActionTypes.SET_FAV,
  payload: {
    songId,
    value,
  },
});
