import React from 'react';
import { useDispatch } from 'react-redux';
import { playPrev } from '../../../redux/player/actions';
import PlayerControl from './PlayerControl';

const PlayerPrevSongControl: React.FC = () => {
  const dispatch = useDispatch();

  const playPrevSong = () => {
    dispatch(playPrev());
  };

  return (
    <PlayerControl title="Previous song" onClick={playPrevSong}>
      <path d="M12 12l12-7v14l-12-7zm-12 0l12-7v14l-12-7z" />
    </PlayerControl>
  );
};

export default PlayerPrevSongControl;
