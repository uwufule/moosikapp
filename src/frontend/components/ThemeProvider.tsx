import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import defaultLightTheme from '@theme/default';
import darkTheme from '@theme/dark';

export type ThemeString = 'dark' | 'light';

export type Theme<P = {}> = ThemedStyledProps<P, typeof defaultLightTheme>;

const getTheme = (theme: string) => {
  switch (theme) {
    case 'dark':
      return darkTheme;
    default:
      return defaultLightTheme;
  }
};

interface AppThemeProviderProps {
  children: JSX.Element[];
  theme?: ThemeString;
}

const AppThemeProvider = ({ children, theme = 'light' }: AppThemeProviderProps) => (
  <ThemeProvider theme={getTheme(theme)}>{children}</ThemeProvider>
);

export default AppThemeProvider;
