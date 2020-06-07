import shared from './common';

const colors = {
  primary: '#212121',
  secondary: '#767676',
  accent: '#f6685e',
  otherText: '#f5f5f5',
  cover: {
    background: '#bdbdbd',
    foreground: '#616161',
  },
  background: '#f5f5f5',
  accentBackground: '#eaeaea',
  input: {
    text: '#212121',
    background: '#f5f5f5',
    border: '#9e9e9e',
    accent: '#f6685e',
  },
  button: {
    text: '#f5f5f5',
    background: '#f6685e',
    accent: '#e5625d',
  },
  shadow: '#212121',
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
