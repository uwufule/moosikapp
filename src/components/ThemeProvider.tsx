import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import dafaultTheme from '../theme/default';

export type Theme<P = {}> = ThemedStyledProps<P, typeof dafaultTheme>;

interface AppThemeProviderProps {
  children: JSX.Element[];
  isDarkMode?: boolean;
}

const AppThemeProvider = ({ children, isDarkMode = false }: AppThemeProviderProps) => (
  <ThemeProvider theme={isDarkMode ? {} : dafaultTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
