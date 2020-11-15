import { RootState } from '@redux/rootReducer';

export const selectErrorMessage = (state: RootState) => state.modal.errorMessage;

export const selectHasErrorMessage = (state: RootState) => !!state.modal.errorMessage;
