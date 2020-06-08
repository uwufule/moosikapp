import { useSelector, useDispatch } from 'react-redux';
import { setShuffle } from '@redux/player/actions';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

const ShuffleButton = () => {
  const shuffle = useSelector<RootState, boolean>(
    (state) => state.player.shuffle,
  );

  const dispatch = useDispatch();

  const toggleShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  return (
    <Control active={shuffle} onClick={toggleShuffle}>
      <Icon>
        <path
          d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,
            13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,
            4L4,5.41L9.17,10.58L10.59,9.17Z"
        />
      </Icon>
    </Control>
  );
};

export default ShuffleButton;
