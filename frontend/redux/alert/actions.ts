import { AlertType, AlertActionType, SetAlertAction } from './types';

export const pushAlert = (message: string, type: AlertType): SetAlertAction => ({
  type: AlertActionType.SET_ALERT,
  payload: { type, message },
});

export const hideAlert = (): SetAlertAction => ({
  type: AlertActionType.SET_ALERT,
  payload: undefined,
});
