import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex } from '@redux/player/actions';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

const NextButton = () => {
  const currentSongIndex = useSelector<RootState, number>(
    (state) => state.player.current.index,
  );

  const songListLength = useSelector<RootState, number>(
    (state) => state.player.songList.length,
  );

  const dispatch = useDispatch();

  const setNextSong = () => {
    if (currentSongIndex < songListLength - 1) {
      dispatch(setCurrentSongIndex(currentSongIndex + 1));
    }
  };

  return (
    <Control onClick={setNextSong}>
      <Icon>
        <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
      </Icon>
    </Control>
  );
};

export default NextButton;
