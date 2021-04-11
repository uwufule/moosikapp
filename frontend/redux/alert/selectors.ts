import { AppState } from '../types';

export const selectAlert = (state: AppState) => state.alert.alert;
