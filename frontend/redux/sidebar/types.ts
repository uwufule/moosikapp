import { Action, AnyAction } from 'redux';

export interface SidebarState {
  isVisible: boolean;
}

export enum SidebarActionType {
  SET_IS_VISIBLE = 'sidebar/SET_IS_VISIBLE',
}

export interface ShowSidebarAction extends Action<SidebarActionType> {
  type: SidebarActionType.SET_IS_VISIBLE;
  payload: true;
}

export interface HideSidebarAction extends Action<SidebarActionType> {
  type: SidebarActionType.SET_IS_VISIBLE;
  payload: false;
}

export type AnySidebarAction = ShowSidebarAction | HideSidebarAction | AnyAction;
