import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRepeat } from '../../../redux/player/actions';
import { selectRepeat } from '../../../redux/player/selectors';
import { RepeatType } from '../../../redux/player/types';
import PlayerControl from './PlayerControl';

const PlayerRepeatControl: React.FC = () => {
  const currentRepeatType = useSelector(selectRepeat);

  const dispatch = useDispatch();

  const toggleRepeatState = () => {
    const repeatTypes: RepeatType[] = ['off', 'single' /*, 'playlist' */];

    const currentRepeatIndex = repeatTypes.indexOf(currentRepeatType);

    const nextRepeatIndex =
      currentRepeatIndex + 1 >= repeatTypes.length ? 0 : currentRepeatIndex + 1;
    const nextRepeatType = repeatTypes[nextRepeatIndex];

    dispatch(setRepeat(nextRepeatType));
  };

  return (
    <PlayerControl
      title="Toggle repeat"
      isActive={currentRepeatType !== 'off'}
      onClick={toggleRepeatState}
    >
      <path d="M2 12c0 .999.381 1.902.989 2.604l-1.098.732-.587.392c-.814-1.025-1.304-2.318-1.304-3.728 0-3.313 2.687-6 6-6h9v-3l6 4-6 4v-3h-9c-2.206 0-4 1.794-4 4zm20.696-3.728l-.587.392-1.098.732c.608.702.989 1.605.989 2.604 0 2.206-1.795 4-4 4h-9v-3l-6 4 6 4v-3h9c3.313 0 6-2.687 6-6 0-1.41-.489-2.703-1.304-3.728z" />
    </PlayerControl>
  );
};

export default PlayerRepeatControl;
