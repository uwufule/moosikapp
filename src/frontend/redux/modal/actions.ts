import { HideErrorMessageAction, ModalActionType, ShowErrorMessageAction } from './types';

export const showErrorMessage = (message: string): ShowErrorMessageAction => ({
  type: ModalActionType.SET_ERROR_MESSAGE,
  payload: message,
});

export const hideErrorMessage = (): HideErrorMessageAction => ({
  type: ModalActionType.SET_ERROR_MESSAGE,
  payload: '',
});
