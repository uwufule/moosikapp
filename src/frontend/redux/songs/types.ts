import Song from '@core/models/Song';
import GetSongsRequestOptions from '@core/services/api/interfaces/GetSongsRequestOptions';
import SearchSongsRequestOptions from '@core/services/api/interfaces/SearchSongsRequestOptions';
import { Action, AnyAction } from 'redux';

export interface SongsState {
  songList: Song[];
  success: boolean;
}

export enum SongsActionType {
  FETCH_SONGS = 'songs/FETCH_SONGS',
  FETCH_FAVORITES = 'songs/FETCH_FAVORITES',
  SEARCH_SONGS = 'songs/SEARCH_SONGS',
  FETCH_SONG_BY_ID = 'songs/FETCH_SONG_BY_ID',
  SET_SONG_LIST = 'songs/SET_SONG_LIST',
  TOGGLE_FAVORITE_STATE_FOR_SONG = 'songs/TOGGLE_FAVORITE_STATE_FOR_SONG',
}

export interface FetchSongsAction extends Action<SongsActionType> {
  type: SongsActionType.FETCH_SONGS;
  payload: GetSongsRequestOptions;
}

export interface FetchFavoritesAction extends Action<SongsActionType> {
  type: SongsActionType.FETCH_FAVORITES;
  payload: GetSongsRequestOptions;
}

export interface SearchSongsAction extends Action<SongsActionType> {
  type: SongsActionType.SEARCH_SONGS;
  payload: SearchSongsRequestOptions;
}

export interface FetchSongByIdAction extends Action<SongsActionType> {
  type: SongsActionType.FETCH_SONG_BY_ID;
  payload: string;
}

export interface SetSongListAction extends Action<SongsActionType> {
  type: SongsActionType.SET_SONG_LIST;
  payload: Song[];
}

export interface ToggleFavoriteStateForSongAction extends Action<SongsActionType> {
  type: SongsActionType.TOGGLE_FAVORITE_STATE_FOR_SONG;
  payload: {
    songId: string;
    value: boolean;
  };
}

export type AnySongsAction =
  | FetchSongsAction
  | FetchFavoritesAction
  | SearchSongsAction
  | FetchSongByIdAction
  | SetSongListAction
  | ToggleFavoriteStateForSongAction
  | AnyAction;
