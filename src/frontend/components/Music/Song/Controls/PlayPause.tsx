import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setCurrentSongIndex, setPlaying } from '@redux/player/actions';
import { RootState } from '@redux/store';
import { Theme } from '@components/ThemeProvider';

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

interface PlayPauseButtonProps {
  songId: string;
  className?: string;
}

const PlayPauseButton = ({ songId, className }: PlayPauseButtonProps) => {
  const playing = useSelector<RootState, boolean>((state) => state.player.playing);

  const currentSongId = useSelector<RootState, string | undefined>(
    (state) => state.player.current.song?.uuid,
  );

  const songIndex = useSelector<RootState, number>((state) =>
    state.player.songList.findIndex((song) => song.uuid === songId),
  );

  const dispatch = useDispatch();

  const togglePlay = () => {
    if (songId === currentSongId) {
      dispatch(setPlaying(!playing));
      return;
    }
    dispatch(setCurrentSongIndex(songIndex));
  };

  const isPlayingThisSong = playing && songId === currentSongId;

  return (
    <Button className={className} title={isPlayingThisSong ? 'Pause' : 'Play'} onClick={togglePlay}>
      <svg viewBox="0 0 24 24">{isPlayingThisSong ? <SvgPaths.Play /> : <SvgPaths.Pause />}</svg>
    </Button>
  );
};

export default PlayPauseButton;
