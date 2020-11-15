import { RootState } from '@redux/rootReducer';

export const selectSongList = (state: RootState) => state.songs.songList;

export const selectSongsRetrieveStatus = (state: RootState) => state.songs.success;
