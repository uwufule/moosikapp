import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import dafaultTheme from '../theme/light';
import darkTheme from '../theme/dark';

export type Theme<P = {}> = ThemedStyledProps<P, typeof dafaultTheme>;

interface AppThemeProviderProps {
  children: JSX.Element[];
  isDarkMode?: boolean;
}

const AppThemeProvider = ({ children, isDarkMode = false }: AppThemeProviderProps) => (
  <ThemeProvider theme={isDarkMode ? darkTheme : dafaultTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
