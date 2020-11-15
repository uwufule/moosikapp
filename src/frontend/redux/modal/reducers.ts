import { AnyModalAction, ModalActionType, ModalState } from './types';

const initialState: ModalState = {
  errorMessage: '',
};

const modalReducer = (state = initialState, action: AnyModalAction) => {
  switch (action.type) {
    case ModalActionType.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default modalReducer;
