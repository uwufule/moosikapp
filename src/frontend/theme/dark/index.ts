import errorModal from './errorModal';
import forms from './forms';
import player from './player';
import songList from './songList';
import uploadForm from './uploadForm';

const theme = {
  background: '#27292d',
  text: {
    primary: '#dfdfe0',
    secondary: '#cacacb',
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
  errorModal,
  shadow: {
    long: '0 0 4px #010101',
    short: '0 0 2px #010101',
  },
  transition: '200ms ease',
};

export default theme;
