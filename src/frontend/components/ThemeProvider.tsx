import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import defaultTheme from '../theme/default';
import darkTheme from '../theme/dark';

export type Theme<P = {}> = ThemedStyledProps<P, typeof defaultTheme>;

interface AppThemeProviderProps {
  children: JSX.Element[];
  darkMode?: boolean;
}

const AppThemeProvider = ({ children, darkMode = false }: AppThemeProviderProps) => (
  <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
