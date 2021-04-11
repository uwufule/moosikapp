import React from 'react';
import { useDispatch } from 'react-redux';
import { playNext } from '../../../redux/player/actions';
import PlayerControl from './PlayerControl';

const PlayerNextSongControl: React.FC = () => {
  const dispatch = useDispatch();

  const playNextSong = () => {
    dispatch(playNext());
  };

  return (
    <PlayerControl title="Next song" onClick={playNextSong}>
      <path d="M0 19v-14l12 7-12 7zm12 0v-14l12 7-12 7z" />
    </PlayerControl>
  );
};

export default PlayerNextSongControl;
