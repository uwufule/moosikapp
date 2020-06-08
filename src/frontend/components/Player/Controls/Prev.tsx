import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex } from '@redux/player/actions';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

const NextButton = () => {
  const currentSongIndex = useSelector<RootState, number>(
    (state) => state.player.current.index,
  );

  const dispatch = useDispatch();

  const setPrevSong = () => {
    if (currentSongIndex > 0) {
      dispatch(setCurrentSongIndex(currentSongIndex - 1));
    }
  };

  return (
    <Control onClick={setPrevSong}>
      <Icon>
        <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
      </Icon>
    </Control>
  );
};

export default NextButton;
