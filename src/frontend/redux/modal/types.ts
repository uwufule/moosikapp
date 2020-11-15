import { Action, AnyAction } from 'redux';

export enum ModalActionType {
  SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE',
}

export interface ModalState {
  errorMessage: string;
}

export interface ShowErrorMessageAction extends Action<ModalActionType> {
  type: ModalActionType.SET_ERROR_MESSAGE;
  payload: string;
}

export interface HideErrorMessageAction extends Action<ModalActionType> {
  type: ModalActionType.SET_ERROR_MESSAGE;
  payload: string;
}

export type AnyModalAction = ShowErrorMessageAction | HideErrorMessageAction | AnyAction;
