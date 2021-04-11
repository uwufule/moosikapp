import DetailedSongData from '../../core/interfaces/DetailedSongData';
import SongData from '../../core/interfaces/SongData';
import {
  ClearPlaylistAction,
  CopySongsToPlaylistAction,
  PauseAction,
  PlayAction,
  PlayerActionType,
  PlayNextAction,
  PlayPrevAction,
  PlaySongByIdAction,
  RepeatType,
  SetCurrentSongAction,
  SetPlayingAction,
  SetPlaylistAction,
  SetRepeatAction,
  SetShuffleAction,
} from './types';

export const clearPlaylist = (): ClearPlaylistAction => ({
  type: PlayerActionType.CLEAR_PLAYLIST,
});

export const copySongListToPlaylist = (): CopySongsToPlaylistAction => ({
  type: PlayerActionType.COPY_SONG_LIST_TO_PLAYLIST,
});

export const setPlaylist = (songs: SongData[]): SetPlaylistAction => ({
  type: PlayerActionType.SET_PLAYLIST,
  payload: songs,
});

export const playSongById = (songId: string): PlaySongByIdAction => ({
  type: PlayerActionType.PLAY_SONG_BY_ID,
  payload: songId,
});

export const setCurrentSong = (song: DetailedSongData): SetCurrentSongAction => ({
  type: PlayerActionType.SET_CURRENT_SONG,
  payload: song,
});

export const play = (): PlayAction => ({
  type: PlayerActionType.PLAY,
});

export const playPrev = (): PlayPrevAction => ({
  type: PlayerActionType.PLAY_PREV,
});

export const playNext = (): PlayNextAction => ({
  type: PlayerActionType.PLAY_NEXT,
});

export const pause = (): PauseAction => ({
  type: PlayerActionType.PAUSE,
});

export const setPlaying = (value: boolean): SetPlayingAction => ({
  type: PlayerActionType.SET_PLAYING,
  payload: value,
});

export const setRepeat = (value: RepeatType): SetRepeatAction => ({
  type: PlayerActionType.SET_REPEAT,
  payload: value,
});

export const setShuffle = (value: boolean): SetShuffleAction => ({
  type: PlayerActionType.SET_SHUFFLE,
  payload: value,
});
