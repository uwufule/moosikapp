import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import theme from '../theme';

export type ThemeProps<P = {}> = ThemedStyledProps<P, typeof theme>;

interface AppThemeProviderProps {
  children: JSX.Element[];
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default AppThemeProvider;
