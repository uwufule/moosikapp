import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShuffle } from '../../../redux/player/actions';
import { selectShuffle } from '../../../redux/player/selectors';
import PlayerControl from './PlayerControl';

const PlayerShuffleControl: React.FC = () => {
  const shuffle = useSelector(selectShuffle);

  const dispatch = useDispatch();

  const toggleShuffleState = () => {
    dispatch(setShuffle(!shuffle));
  };

  return (
    <PlayerControl title="Shuffle" isActive={shuffle} onClick={toggleShuffleState}>
      <path d="M2 7h-2v-2h2c3.49 0 5.48 1.221 6.822 2.854-.41.654-.754 1.312-1.055 1.939-1.087-1.643-2.633-2.793-5.767-2.793zm16 10c-3.084 0-4.604-1.147-5.679-2.786-.302.627-.647 1.284-1.06 1.937 1.327 1.629 3.291 2.849 6.739 2.849v3l6-4-6-4v3zm0-10v3l6-4-6-4v3c-5.834 0-7.436 3.482-8.85 6.556-1.343 2.921-2.504 5.444-7.15 5.444h-2v2h2c5.928 0 7.543-3.511 8.968-6.609 1.331-2.893 2.479-5.391 7.032-5.391z" />{' '}
    </PlayerControl>
  );
};

export default PlayerShuffleControl;
