import { createGlobalStyle } from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    font-family: ${(props: ThemeProps) => props.theme.font};
  }

  body {
    height: inherit;
    margin: 0;
    background: ${(props: ThemeProps) => props.theme.colors.dark};
  }

  #__next {
    height: inherit;
  }

  * {
    box-sizing: border-box;
  }

  input, textarea, button {
    -webkit-appearance: none;
  }
`;

export default GlobalStyle;
