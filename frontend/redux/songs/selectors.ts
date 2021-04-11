import { AppState } from '../types';

export const selectSongList = (state: AppState) => state.songs.songList;

export const selectFetchSongsStatus = (state: AppState) => state.songs.success;

export const selectSongsSource = (state: AppState) => state.songs.source;

export const selectSongListOffset = (state: AppState) => state.songs.offset;
