import { AnySongsAction, SongsActionType, SongsState } from './types';

const initialState: SongsState = {
  songList: [],
  source: undefined,
  offset: 0,
  success: false,
};

const songsReducer = (state = initialState, action: AnySongsAction): SongsState => {
  switch (action.type) {
    case SongsActionType.SELECT_SONGS_SOURCE:
      return { ...state, source: action.payload, success: false };

    case SongsActionType.CLEAR_SONG_LIST:
      return { ...state, songList: [], offset: 0 };

    case SongsActionType.PUSH_SONGS_TO_SONG_LIST:
      return { ...state, songList: [...state.songList, ...action.payload] };

    case SongsActionType.SET_SONG_LIST_OFFSET:
      return { ...state, offset: action.payload };

    case SongsActionType.UPDATE_SONG:
      return {
        ...state,
        songList: state.songList.map((song) => {
          return song.id === action.payload.songId ? { ...song, ...action.payload.data } : song;
        }),
      };

    default:
      return state;
  }
};

export default songsReducer;
