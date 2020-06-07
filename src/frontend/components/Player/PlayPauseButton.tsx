import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex, setPlaying } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import Control from './PlayerControl';

const PlayPauseButton = () => {
  const songList = useSelector<RootState, Song[]>(
    (state) => state.player.songList,
  );

  const songIndex = useSelector<RootState, number>(
    (state) => state.player.current.index,
  );

  const playing = useSelector<RootState, boolean>(
    (state) => state.player.playing,
  );

  const dispatch = useDispatch();

  const handleClick = () => {
    if (songList.length > 0) {
      if (songIndex === -1) {
        dispatch(setCurrentSongIndex(0));
      }

      dispatch(setPlaying(!playing));
    }
  };

  return (
    <Control caption="Play / Pause" handler={handleClick}>
      {playing
        ? <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
        : <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />}
    </Control>
  );
};

export default PlayPauseButton;
