import { RootState } from '@redux/rootReducer';

export const selectPlaylist = (state: RootState) => state.player.playlist;

export const selectPlaylistSize = (state: RootState) => state.player.playlist.length;

export const selectNowPlaying = (state: RootState) => state.player.nowPlaying;

export const selectNowPlayingSongId = (state: RootState) => state.player.nowPlaying?.id;

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;

export const selectRepeat = (state: RootState) => state.player.repeat;

export const selectShuffle = (state: RootState) => state.player.shuffle;
