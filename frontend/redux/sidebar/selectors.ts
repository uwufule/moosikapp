import { AppState } from '../types';

export const selectSidebarVisible = (state: AppState) => state.sidebar.isVisible;
