import { AnyPlayerAction, PlayerActionType, PlayerState } from './types';

const initialState: PlayerState = {
  playlist: [],
  nowPlaying: undefined,
  isPlaying: false,
  repeat: 'off',
  shuffle: false,
};

const playerReducer = (state = initialState, action: AnyPlayerAction): PlayerState => {
  switch (action.type) {
    case PlayerActionType.SET_PLAYLIST:
      return { ...state, playlist: action.payload };

    case PlayerActionType.SET_NOW_PLAYING: {
      return { ...state, nowPlaying: action.payload };
    }

    case PlayerActionType.SET_IS_PLAYING:
      return { ...state, isPlaying: action.payload };

    case PlayerActionType.SET_REPEAT:
      return { ...state, repeat: action.payload };

    case PlayerActionType.SET_SHUFFLE:
      return { ...state, shuffle: action.payload };

    default:
      return state;
  }
};

export default playerReducer;
