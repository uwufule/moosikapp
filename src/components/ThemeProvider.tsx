import { ThemeProvider, ThemedStyledProps } from 'styled-components';
import theme from '../theme';

interface ThemeProviderProps {
  children: JSX.Element[];
}

export type ThemeProps<P = {}> = ThemedStyledProps<P, typeof theme>;

export default ({ children }: ThemeProviderProps) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
