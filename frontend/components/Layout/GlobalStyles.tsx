import { createGlobalStyle } from 'styled-components';
import Nunito from './fonts/NunitoRegular.ttf';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito});
  }

  html {
    font-family: Nunito, BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: subpixel-antialiased;
  }

  html {
    height: 100%;
    height: -webkit-fill-available;
  }

  body {
    height: 100%;
  }

  #__next {
    height: 100%;
  }

  ::selection {
    color: #fff;
    background: #7da4de;
  }
`;

export default GlobalStyles;
