import defaultTheme from '@theme/index';
import { ThemedStyledProps, ThemeProvider } from 'styled-components';

export type ThemeString = 'default';

export type Theme<P = {}> = ThemedStyledProps<P, typeof defaultTheme>;

const getTheme = (theme: ThemeString) => {
  switch (theme) {
    default:
      return defaultTheme;
  }
};

interface AppThemeProviderProps {
  children: JSX.Element[];
  theme?: ThemeString;
}

const AppThemeProvider = ({ children, theme = 'default' }: AppThemeProviderProps) => (
  <ThemeProvider theme={getTheme(theme)}>{children}</ThemeProvider>
);

export default AppThemeProvider;
