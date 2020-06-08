import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex, setPlaying } from '@redux/player/actions';
import { RootState } from '@redux/store';
import { Control, Icon } from './Control';

const PlayPauseButton = () => {
  const songListLength = useSelector<RootState, number>(
    (state) => state.player.songList.length,
  );

  const songIndex = useSelector<RootState, number>(
    (state) => state.player.current.index,
  );

  const playing = useSelector<RootState, boolean>(
    (state) => state.player.playing,
  );

  const dispatch = useDispatch();

  const handleClick = () => {
    if (songListLength > 0) {
      if (songIndex === -1) {
        dispatch(setCurrentSongIndex(0));
        return;
      }

      dispatch(setPlaying(!playing));
    }
  };

  return (
    <Control title="Play / Pause" onClick={handleClick}>
      <Icon>
        {playing
          ? <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          : <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />}
      </Icon>
    </Control>
  );
};

export default PlayPauseButton;
