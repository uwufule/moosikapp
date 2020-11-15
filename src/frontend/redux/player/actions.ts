import Song from '@core/models/Song';
import SongDetails from '@core/models/SongDetails';
import {
  PlayerActionType,
  PlaySongByIdAction,
  PushSongListToPlaylistAction,
  RepeatType,
  SetNowPlayingAction,
  SetPlaylistAction,
  SetRepeatAction,
  SetShuffleAction,
  TogglePlayAction,
} from './types';

export const setPlaylist = (songs: Song[]): SetPlaylistAction => ({
  type: PlayerActionType.SET_PLAYLIST,
  payload: songs,
});

export const pushSongListToPlaylist = (playFirst = false): PushSongListToPlaylistAction => ({
  type: PlayerActionType.PUSH_SONG_LIST_TO_PLAYLIST,
  payload: playFirst,
});

export const playSongById = (songId: string): PlaySongByIdAction => ({
  type: PlayerActionType.PLAY_SONG_BY_ID,
  payload: songId,
});

export const setNowPlaying = (song: SongDetails): SetNowPlayingAction => ({
  type: PlayerActionType.SET_NOW_PLAYING,
  payload: song,
});

export const togglePlay = (playing: boolean): TogglePlayAction => ({
  type: PlayerActionType.SET_IS_PLAYING,
  payload: playing,
});

export const setRepeat = (repeat: RepeatType): SetRepeatAction => ({
  type: PlayerActionType.SET_REPEAT,
  payload: repeat,
});

export const setShuffle = (shuffle: boolean): SetShuffleAction => ({
  type: PlayerActionType.SET_SHUFFLE,
  payload: shuffle,
});
