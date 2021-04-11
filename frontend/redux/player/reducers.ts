import { AnyPlayerAction, PlayerActionType, PlayerState } from './types';

const initialState: PlayerState = {
  playlist: [],
  currentSong: null,
  playing: false,
  repeat: 'off',
  shuffle: false,
};

const playerReducer = (state = initialState, action: AnyPlayerAction): PlayerState => {
  switch (action.type) {
    case PlayerActionType.SET_PLAYLIST:
      return { ...state, playlist: action.payload };

    case PlayerActionType.CLEAR_PLAYLIST:
      return { ...state, playlist: [] };

    case PlayerActionType.SET_CURRENT_SONG:
      return { ...state, currentSong: action.payload };

    case PlayerActionType.PAUSE:
      return { ...state, playing: false };

    case PlayerActionType.SET_PLAYING:
      return { ...state, playing: action.payload };

    case PlayerActionType.SET_REPEAT:
      return { ...state, repeat: action.payload };

    case PlayerActionType.SET_SHUFFLE:
      return { ...state, shuffle: action.payload };

    default:
      return state;
  }
};

export default playerReducer;
