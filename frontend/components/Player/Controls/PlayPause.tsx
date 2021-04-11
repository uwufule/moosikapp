import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pause, play } from '../../../redux/player/actions';
import { selectPlaying } from '../../../redux/player/selectors';
import PlayerControl from './PlayerControl';

const PlayerPlayPauseControl: React.FC = () => {
  const playing = useSelector(selectPlaying);

  const dispatch = useDispatch();

  const playSong = () => {
    dispatch(playing ? pause() : play());
  };

  return (
    <PlayerControl title={playing ? 'Pause' : 'Play'} onClick={playSong}>
      {playing ? (
        <path d="M10 22h-6v-20h6v20zm10-20h-6v20h6v-20z" />
      ) : (
        <path d="M3 22v-20l18 10-18 10z" />
      )}
    </PlayerControl>
  );
};

export default PlayerPlayPauseControl;
