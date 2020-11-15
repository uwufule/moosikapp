import { pushSongListToPlaylist, togglePlay } from '@redux/player/actions';
import { selectIsPlaying, selectPlaylistSize } from '@redux/player/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { IndentedControl, Icon } from './Control';

const PlayPauseButton = () => {
  const isPlaying = useSelector(selectIsPlaying);
  const playlistSize = useSelector(selectPlaylistSize);

  const dispatch = useDispatch();

  const handleClick = () => {
    if (playlistSize === 0) {
      dispatch(pushSongListToPlaylist(true));
      return;
    }

    dispatch(togglePlay(!isPlaying));
  };

  return (
    <IndentedControl title="Play / Pause" onClick={handleClick}>
      <Icon>
        {isPlaying ? (
          <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
        ) : (
          <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        )}
      </Icon>
    </IndentedControl>
  );
};

export default PlayPauseButton;
