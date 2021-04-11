import { SidebarState, AnySidebarAction, SidebarActionType } from './types';

const initialState: SidebarState = {
  isVisible: false,
};

const sidebarReducer = (state = initialState, action: AnySidebarAction) => {
  switch (action.type) {
    case SidebarActionType.SET_IS_VISIBLE:
      return { isVisible: action.payload };

    default:
      return state;
  }
};

export default sidebarReducer;
