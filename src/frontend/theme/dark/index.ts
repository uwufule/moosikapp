import forms from './forms';
import songList from './songList';
import uploadForm from './uploadForm';
import player from './player';

const theme = {
  background: '#27292d',
  text: {
    primary: '#dfdfe0',
    secondary: '#b4b4b6',
  },
  nav: {
    logo: '#dfdfe0',
    link: {
      inactive: '#dfdfe0',
      active: '#cb5a52',
    },
  },
  forms,
  songList,
  uploadForm,
  player,
  shadow: {
    long: '0 0 4px #010101',
    short: '0 0 2px #010101',
  },
  transition: '200ms ease',
};

export default theme;
