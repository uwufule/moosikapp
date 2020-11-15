import { setRepeat } from '@redux/player/actions';
import { selectRepeat } from '@redux/player/selectors';
import { RepeatType } from '@redux/player/types';
import { useDispatch, useSelector } from 'react-redux';
import { IndentedControl, Icon } from './Control';

const RepeatButton = () => {
  const repeat = useSelector(selectRepeat);

  const dispatch = useDispatch();

  const handleClick = () => {
    const repeatTypes: RepeatType[] = ['off', 'single', 'many'];

    const nextRepeatTypeIndex = repeatTypes.indexOf(repeat) + 1;
    const nextRepeatType =
      repeatTypes[nextRepeatTypeIndex < repeatTypes.length ? nextRepeatTypeIndex : 0];

    dispatch(setRepeat(nextRepeatType));
  };

  return (
    <IndentedControl active={repeat !== 'off'} onClick={handleClick}>
      <Icon>
        {repeat === 'single' ? (
          <>
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
          </>
        ) : (
          <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
        )}
      </Icon>
    </IndentedControl>
  );
};

export default RepeatButton;
