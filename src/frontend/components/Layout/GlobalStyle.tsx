import { createGlobalStyle } from 'styled-components';
import { Theme } from '@components/ThemeProvider';

import Nunito from './fonts/NunitoRegular.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito});
  }

  html {
    font-family: Nunito, BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body {
    display: flex;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    margin: 0;
    background: ${(props: Theme) => props.theme.colors.background};
  }

  #__next {
    position: relative;
    flex: 1;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
`;

export default GlobalStyle;
