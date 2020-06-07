import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import defaultTheme from '@theme/default';
import darkTheme from '@theme/dark';

export type Theme<P = {}> = ThemedStyledProps<P, typeof defaultTheme>;

const getTheme = (theme: string) => {
  switch (theme) {
    case 'dark':
      return darkTheme;
    default:
      return defaultTheme;
  }
};

interface AppThemeProviderProps {
  children: JSX.Element[];
  theme?: string; // 'dark' | 'light'
}

const AppThemeProvider = ({ children, theme = 'default' }: AppThemeProviderProps) => (
  <ThemeProvider theme={getTheme(theme)}>{children}</ThemeProvider>
);

export default AppThemeProvider;
