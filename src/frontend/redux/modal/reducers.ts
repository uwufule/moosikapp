import { AnyModalAction, ModalActionTypes, ModalState } from './types';

const initialState: ModalState = {
  errorMessage: '',
};

export default (state = initialState, action: AnyModalAction) => {
  switch (action.type) {
    case ModalActionTypes.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};
