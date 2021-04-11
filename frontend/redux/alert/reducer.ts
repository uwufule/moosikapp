import { AnyAlertAction, AlertActionType, AlertState } from './types';

const initialState: AlertState = {
  alert: undefined,
};

const alertReducer = (state = initialState, action: AnyAlertAction) => {
  switch (action.type) {
    case AlertActionType.SET_ALERT:
      return { alert: action.payload };

    default:
      return state;
  }
};

export default alertReducer;
