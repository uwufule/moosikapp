import { string } from '@hapi/joi';

export enum ModalActionTypes {
  SET_ERROR_MESSAGE = 'set_error_message',
}

export interface ModalState {
  errorMessage: string;
}

export interface ShowErrorMessageAction {
  type: ModalActionTypes.SET_ERROR_MESSAGE;
  payload: string;
}

export interface HideErrorMessageAction {
  type: ModalActionTypes.SET_ERROR_MESSAGE;
  payload: string;
}

export type AnyModalAction = ShowErrorMessageAction | HideErrorMessageAction;
