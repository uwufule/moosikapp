import PlayerActions from './constants';
import { SongData, DetailedSongData } from './types';
import { PlayerActionTypes } from './actions';

export interface PlayerState {
  songList: SongData[];
  currentSong: DetailedSongData | null;
  paused: boolean;
  nowPlaying: number;
}

const initialState: PlayerState = {
  songList: [],
  currentSong: null,
  paused: true,
  nowPlaying: -1,
};

const playerReducer = (
  state = initialState, action: PlayerActionTypes,
) => {
  switch (action.type) {
    case PlayerActions.SET_SONG_LIST:
      return { ...state, songList: action.payload };
    case PlayerActions.PLAY_SONG:
      return { ...state, currentSong: action.payload };
    case PlayerActions.SET_PAUSED:
      return { ...state, paused: action.payload };
    case PlayerActions.SET_NOW_PLAYING:
      return { ...state, nowPlaying: action.payload };
    default:
      return state;
  }
};

export default playerReducer;
