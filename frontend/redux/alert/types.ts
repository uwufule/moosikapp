import { Action, AnyAction } from 'redux';

export type AlertType = 'info' | 'error';

export interface Alert {
  message: string;
  type: AlertType;
}

export enum AlertActionType {
  SET_ALERT = 'alert/SET_ALERT',
}

export interface AlertState {
  alert?: Alert;
}

export interface SetAlertAction extends Action<AlertActionType> {
  type: AlertActionType.SET_ALERT;
  payload?: Alert;
}

export type AnyAlertAction = SetAlertAction | AnyAction;
