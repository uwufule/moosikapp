import { Theme } from '@components/ThemeProvider';
import { playSongById, pushSongListToPlaylist, togglePlay } from '@redux/player/actions';
import { selectIsPlaying, selectNowPlayingSongId, selectPlaylist } from '@redux/player/selectors';
import { selectSongList } from '@redux/songs/selectors';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Button = styled.button.attrs({ type: 'button' })`
  width: 36px;
  height: 36px;
  position: absolute;
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  outline: 0;
  fill: ${(props: Theme) => props.theme.songList.song.playPayseButton};
  filter: drop-shadow(${(props: Theme) => props.theme.shadow.short});
  z-index: 1;
  cursor: pointer;
`;

const SvgPaths = {
  Play: () => (
    <path
      d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0
        12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
    />
  ),
  Pause: () => (
    <path
      d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0
        0,0 22,12A10,10 0 0,0 12,2Z"
    />
  ),
};

interface PlayPauseProps {
  songId: string;
  className?: string;
}

const PlayPause = ({ songId, className }: PlayPauseProps) => {
  const nowPlayingId = useSelector(selectNowPlayingSongId);
  const isPlaying = useSelector(selectIsPlaying);

  const playlist = useSelector(selectPlaylist);
  const songList = useSelector(selectSongList);

  const dispatch = useDispatch();

  const handleClick = () => {
    const isSamePlaylist = isEqual(sortBy(songList), sortBy(playlist));
    if (!isSamePlaylist) {
      dispatch(pushSongListToPlaylist());
    }

    if (songId !== nowPlayingId) {
      dispatch(playSongById(songId));
      return;
    }

    dispatch(togglePlay(!isPlaying));
  };

  const isPlayingThisSong = songId === nowPlayingId && isPlaying;

  return (
    <Button
      className={className}
      title={isPlayingThisSong ? 'Pause' : 'Play'}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24">{isPlayingThisSong ? <SvgPaths.Play /> : <SvgPaths.Pause />}</svg>
    </Button>
  );
};

export default PlayPause;
