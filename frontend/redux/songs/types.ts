import { Action } from 'redux';
import SongData from '../../core/interfaces/SongData';
import { GetSongsRequestParams, SearchSongsRequestParams } from '../../core/services/api/songs';

interface AllSongsSource {
  type: 'songs/all';
  params: GetSongsRequestParams;
}

interface FavoriteSongsSource {
  type: 'songs/favorites';
  params: GetSongsRequestParams;
}

interface SearchSongsSource {
  type: 'songs/search';
  params: SearchSongsRequestParams;
}

export type SongsSources = AllSongsSource | FavoriteSongsSource | SearchSongsSource;

export interface SongsState {
  songList: SongData[];
  source?: SongsSources;
  offset: number;
  success: boolean;
}

export enum SongsActionType {
  SELECT_SONGS_SOURCE = 'songs/SELECT_SONGS_SOURCE',
  FETCH_SONGS = 'songs/FETCH_SONGS',
  SET_SONG_LIST_OFFSET = 'songs/SET_SONG_LIST_OFFSET',
  CLEAR_SONG_LIST = 'songs/CLEAR_SONG_LIST',
  PUSH_SONGS_TO_SONG_LIST = 'songs/PUSH_SONGS_TO_SONG_LIST',
  UPDATE_SONG = 'songs/UPDATE_SONG',
}

export interface ClearSongsSourceAction extends Action<SongsActionType> {
  type: SongsActionType.SELECT_SONGS_SOURCE;
  payload: undefined;
}

export interface SetAllSongsSourceAction extends Action<SongsActionType> {
  type: SongsActionType.SELECT_SONGS_SOURCE;
  payload: AllSongsSource;
}

export interface SetFavoriteSongsSourceAction extends Action<SongsActionType> {
  type: SongsActionType.SELECT_SONGS_SOURCE;
  payload: FavoriteSongsSource;
}

export interface SetSearchSongsSourceAction extends Action<SongsActionType> {
  type: SongsActionType.SELECT_SONGS_SOURCE;
  payload: SearchSongsSource;
}

export interface FetchSongsAction extends Action<SongsActionType> {
  type: SongsActionType.FETCH_SONGS;
}

export interface SetSongListOffsetAction extends Action<SongsActionType> {
  type: SongsActionType.SET_SONG_LIST_OFFSET;
  payload: number;
}

export interface ClearSongListAction extends Action<SongsActionType> {
  type: SongsActionType.CLEAR_SONG_LIST;
}

export interface PushSongsToSongListAction extends Action<SongsActionType> {
  type: SongsActionType.PUSH_SONGS_TO_SONG_LIST;
  payload: SongData[];
}

export interface NewSongData {
  favorite?: boolean;
}

export interface UpdateSongAction extends Action<SongsActionType> {
  type: SongsActionType.UPDATE_SONG;
  payload: {
    songId: string;
    data: NewSongData;
  };
}

export type AnySongsAction =
  | SetAllSongsSourceAction
  | SetFavoriteSongsSourceAction
  | SetSearchSongsSourceAction
  | FetchSongsAction
  | SetSongListOffsetAction
  | ClearSongListAction
  | PushSongsToSongListAction
  | UpdateSongAction;
