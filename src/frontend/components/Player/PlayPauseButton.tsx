import { useSelector, useDispatch } from 'react-redux';
import Control from './PlayerControl';
import { RootState } from '../../redux/store';
import { Song } from '../../redux/player/types';
import { setCurrentSongIndex, togglePlaying } from '../../redux/player/actions';

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

  const clickHandler = () => {
    if (songList.length > 0) {
      if (songIndex === -1) {
        dispatch(setCurrentSongIndex(0));
      }

      dispatch(togglePlaying(!playing));
    }
  };

  return (
    <Control caption="Play / Pause" handler={clickHandler}>
      {playing
        ? <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
        : <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />}
    </Control>
  );
};

export default PlayPauseButton;
