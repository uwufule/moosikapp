import Song from '@core/models/Song';
import GetSongsRequestOptions from '@core/services/api/interfaces/GetSongsRequestOptions';
import SearchSongsRequestOptions from '@core/services/api/interfaces/SearchSongsRequestOptions';
import {
  FetchFavoritesAction,
  FetchSongByIdAction,
  FetchSongsAction,
  SearchSongsAction,
  SetSongListAction,
  SongsActionType,
  ToggleFavoriteStateForSongAction,
} from './types';

export const fetchSongs = (options: GetSongsRequestOptions): FetchSongsAction => ({
  type: SongsActionType.FETCH_SONGS,
  payload: options,
});

export const fetchFavorites = (options: GetSongsRequestOptions): FetchFavoritesAction => ({
  type: SongsActionType.FETCH_FAVORITES,
  payload: options,
});

export const searchSongs = (options: SearchSongsRequestOptions): SearchSongsAction => ({
  type: SongsActionType.SEARCH_SONGS,
  payload: options,
});

export const fetchSongById = (songId: string): FetchSongByIdAction => ({
  type: SongsActionType.FETCH_SONG_BY_ID,
  payload: songId,
});

export const setSongList = (songList: Song[]): SetSongListAction => ({
  type: SongsActionType.SET_SONG_LIST,
  payload: songList,
});

export const toggleFavoriteStateForSong = (
  songId: string,
  value: boolean,
): ToggleFavoriteStateForSongAction => ({
  type: SongsActionType.TOGGLE_FAVORITE_STATE_FOR_SONG,
  payload: {
    songId,
    value,
  },
});
