import { ShowErrorMessageAction, ModalActionTypes, HideErrorMessageAction } from './types';

export const showErrorMessage = (message: string): ShowErrorMessageAction => ({
  type: ModalActionTypes.SET_ERROR_MESSAGE,
  payload: message,
});

export const hideErrorMessage = (): HideErrorMessageAction => ({
  type: ModalActionTypes.SET_ERROR_MESSAGE,
  payload: '',
});
