import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import defaultTheme from '../theme/default';
import darkTheme from '../theme/dark';

export type Theme<P = {}> = ThemedStyledProps<P, typeof defaultTheme>;

interface AppThemeProviderProps {
  children: JSX.Element[];
  isDarkMode?: boolean;
}

const AppThemeProvider = ({ children, isDarkMode = false }: AppThemeProviderProps) => (
  <ThemeProvider theme={isDarkMode ? darkTheme : defaultTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
