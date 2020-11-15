import { AnySongsAction, SongsActionType, SongsState } from './types';

const initialState: SongsState = {
  songList: [],
  success: false,
};

const songsReducer = (state = initialState, action: AnySongsAction): SongsState => {
  switch (action.type) {
    case SongsActionType.FETCH_SONGS:
    case SongsActionType.FETCH_FAVORITES:
    case SongsActionType.SEARCH_SONGS:
    case SongsActionType.FETCH_SONG_BY_ID:
      return { ...state, success: false };

    case SongsActionType.SET_SONG_LIST:
      return { songList: action.payload, success: true };

    case SongsActionType.TOGGLE_FAVORITE_STATE_FOR_SONG:
      return {
        ...state,
        songList: state.songList.map((song) =>
          song.id === action.payload.songId ? { ...song, favorite: action.payload.value } : song,
        ),
      };

    default:
      return state;
  }
};

export default songsReducer;
