import { createGlobalStyle } from 'styled-components';
import { Theme } from '@components/ThemeProvider';

import Nunito from './fonts/NunitoRegular.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito});
  }

  html {
    font-family: 'Nunito';
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
