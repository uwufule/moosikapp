import { HideSidebarAction, ShowSidebarAction, SidebarActionType } from './types';

export const showSidebar = (): ShowSidebarAction => ({
  type: SidebarActionType.SET_IS_VISIBLE,
  payload: true,
});

export const hideSidebar = (): HideSidebarAction => ({
  type: SidebarActionType.SET_IS_VISIBLE,
  payload: false,
});
