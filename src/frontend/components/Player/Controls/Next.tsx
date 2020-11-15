import { PlayerActionType } from '@redux/player/types';
import { useDispatch } from 'react-redux';
import { IndentedControl, Icon } from './Control';

const NextButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: PlayerActionType.PLAY_NEXT });
  };

  return (
    <IndentedControl onClick={handleClick}>
      <Icon>
        <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
      </Icon>
    </IndentedControl>
  );
};

export default NextButton;
