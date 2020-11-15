import { PlayerActionType } from '@redux/player/types';
import { useDispatch } from 'react-redux';
import { IndentedControl, Icon } from './Control';

const PrevButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: PlayerActionType.PLAY_PREV });
  };

  return (
    <IndentedControl onClick={handleClick}>
      <Icon>
        <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
      </Icon>
    </IndentedControl>
  );
};

export default PrevButton;
