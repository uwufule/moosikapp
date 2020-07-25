import { useSelector, useDispatch } from 'react-redux';
import { setRepeat } from '@redux/player/actions';
import { RepeatTypes } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

const RepeatButton = () => {
  const repeat = useSelector<RootState, RepeatTypes>((state) => state.player.repeat);

  const dispatch = useDispatch();

  const toggleRepeat = () => {
    dispatch(setRepeat(repeat === 'off' ? 'single' : 'off'));
  };

  return (
    <Control active={repeat !== 'off'} onClick={toggleRepeat}>
      <Icon>
        <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
      </Icon>
    </Control>
  );
};

export default RepeatButton;
