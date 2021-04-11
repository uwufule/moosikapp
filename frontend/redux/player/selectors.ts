import { AppState } from '../types';

export const selectPlaylist = (state: AppState) => state.player.playlist;

export const selectPlaylistSize = (state: AppState) => state.player.playlist.length;

export const selectCurrentSong = (state: AppState) => state.player.currentSong;

export const selectCurrentSongId = (state: AppState) => state.player.currentSong?.id;

export const selectPlaying = (state: AppState) => state.player.playing;

export const selectRepeat = (state: AppState) => state.player.repeat;

export const selectShuffle = (state: AppState) => state.player.shuffle;
