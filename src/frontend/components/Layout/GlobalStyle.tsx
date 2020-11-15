import { Theme } from '@components/ThemeProvider';
import { createGlobalStyle } from 'styled-components';
import Nunito from './fonts/NunitoRegular.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito});
  }

  html {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    font-family: Nunito, BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body {
    width: 100%;
    height: 100%;
    position: absolute;
    margin: 0;
    background: ${(props: Theme) => props.theme.background};
  }

  #__next {
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
`;

export default GlobalStyle;
