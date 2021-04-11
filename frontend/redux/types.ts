import { AlertState } from './alert/types';
import { AuthState } from './auth/types';
import { PlayerState } from './player/types';
import { SidebarState } from './sidebar/types';
import { SongsState } from './songs/types';

export interface AppState {
  auth: AuthState;
  alert: AlertState;
  player: PlayerState;
  sidebar: SidebarState;
  songs: SongsState;
}
