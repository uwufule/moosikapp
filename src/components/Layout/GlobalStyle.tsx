import { createGlobalStyle } from 'styled-components';
import { Theme } from '../ThemeProvider';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    font-family: ${(props: Theme) => props.theme.font};
  }

  body {
    height: inherit;
    margin: 0;
    background: ${(props: Theme) => props.theme.colors.body.background};
  }

  #__next {
    height: inherit;
    position: relative;
  }

  * {
    box-sizing: border-box;
  }

  input, textarea, button {
    -webkit-appearance: none;
  }
`;

export default GlobalStyle;
