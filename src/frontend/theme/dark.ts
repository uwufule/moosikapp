import shared from './common';

const colors = {
  primary: '#dfdfe0',
  secondary: '#b4b4b6',
  accent: '#cb5a52',
  otherText: '#dfdfe0',
  cover: {
    background: '#383b40',
    foreground: '#1f2023',
  },
  background: '#27292d',
  accentBackground: '#2d2f34',
  input: {
    text: '#dedede',
    background: '#383b40',
    border: '#383b40',
    accent: '#cb5a52',
  },
  button: {
    text: '#d4d4d5',
    background: '#cb5a52',
    accent: '#b1524c',
  },
  shadow: '#010101',
};

const theme = {
  colors,
  shadow: {
    long: `0 0 4px ${colors.shadow}`,
    short: `0 0 2px ${colors.shadow}`,
  },
  ...shared,
};

export default theme;
