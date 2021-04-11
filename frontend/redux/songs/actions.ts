import SongData from '../../core/interfaces/SongData';
import { GetSongsRequestParams, SearchSongsRequestParams } from '../../core/services/api/songs';
import {
  ClearSongListAction,
  ClearSongsSourceAction,
  FetchSongsAction,
  PushSongsToSongListAction,
  SetAllSongsSourceAction,
  SetFavoriteSongsSourceAction,
  SetSearchSongsSourceAction,
  SetSongListOffsetAction,
  SongsActionType,
  UpdateSongAction,
} from './types';

export const clearSongsSource = (): ClearSongsSourceAction => ({
  type: SongsActionType.SELECT_SONGS_SOURCE,
  payload: undefined,
});

export const setAllSongsSource = (params: GetSongsRequestParams): SetAllSongsSourceAction => ({
  type: SongsActionType.SELECT_SONGS_SOURCE,
  payload: {
    type: 'songs/all',
    params,
  },
});

export const setFavoriteSongsSource = (
  params: GetSongsRequestParams,
): SetFavoriteSongsSourceAction => ({
  type: SongsActionType.SELECT_SONGS_SOURCE,
  payload: {
    type: 'songs/favorites',
    params,
  },
});

export const setSearchSongsSource = (
  params: SearchSongsRequestParams,
): SetSearchSongsSourceAction => ({
  type: SongsActionType.SELECT_SONGS_SOURCE,
  payload: {
    type: 'songs/search',
    params,
  },
});

export const fetchSongs = (): FetchSongsAction => ({
  type: SongsActionType.FETCH_SONGS,
});

export const setSongListOffset = (value: number): SetSongListOffsetAction => ({
  type: SongsActionType.SET_SONG_LIST_OFFSET,
  payload: value,
});

export const clearSongList = (): ClearSongListAction => ({
  type: SongsActionType.CLEAR_SONG_LIST,
});

export const pushSongsToSongList = (songs: SongData[]): PushSongsToSongListAction => ({
  type: SongsActionType.PUSH_SONGS_TO_SONG_LIST,
  payload: songs,
});

export const toggleFavoriteStateForSong = (songId: string, value: boolean): UpdateSongAction => ({
  type: SongsActionType.UPDATE_SONG,
  payload: {
    songId,
    data: {
      favorite: value,
    },
  },
});
