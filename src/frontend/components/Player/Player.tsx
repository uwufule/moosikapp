import { Theme } from '@components/ThemeProvider';
import { setPlaylist } from '@redux/player/actions';
import {
  selectIsPlaying,
  selectNowPlaying,
  selectPlaylist,
  selectRepeat,
  selectShuffle,
} from '@redux/player/selectors';
import { PlayerActionType } from '@redux/player/types';
import { selectSongList } from '@redux/songs/selectors';
import isMobile from 'is-mobile';
import lodashShuffle from 'lodash/shuffle';
import Head from 'next/head';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAudio } from 'react-use';
import styled from 'styled-components';
import NextButton from './Controls/Next';
import PlayPauseButton from './Controls/PlayPause';
import PrevButton from './Controls/Prev';
import RepeatButton from './Controls/Repeat';
import ShuffleButton from './Controls/Shuffle';
import VolumeButton from './Controls/Volume';
import SoundBadge from './SoundBadge';
import Timeline from './Timeline';
import VolumeSlider from './VolumeSlider';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  background: ${(props: Theme) => props.theme.player.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.short};
  z-index: 1;
`;

const PlayerContainer = styled.section`
  display: flex;
  align-items: center;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;

  @media (max-width: 480px) {
    & {
      flex-direction: column;
      align-items: unset;
      padding-top: 4px;
    }
  }
`;

const ControlsGroup = styled.div`
  display: flex;

  @media (max-width: 480px) {
    & {
      justify-content: space-between;
    }
  }
`;

const VolumeControlWrapper = styled.div`
  position: relative;

  @media (max-width: 640px) {
    & {
      display: none;
    }
  }
`;

const Player = () => {
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);

  const songList = useSelector(selectSongList);
  const playlist = useSelector(selectPlaylist);

  const nowPlaying = useSelector(selectNowPlaying);

  const isPlaying = useSelector(selectIsPlaying);
  const repeat = useSelector(selectRepeat);
  const shuffle = useSelector(selectShuffle);

  const dispatch = useDispatch();

  const [audio, playerState, playerControls, ref] = useAudio({
    crossOrigin: 'anonymous',
    preload: 'auto',
    src: nowPlaying?.url ?? '',
    autoPlay: false,
  });

  // toggle play/pause
  React.useEffect(() => {
    playerControls[isPlaying ? 'play' : 'pause']();
  }, [nowPlaying, isPlaying]);

  // toggle repeat single
  React.useEffect(() => {
    if (ref.current) {
      ref.current.loop = repeat === 'single';
    }
  }, [repeat]);

  // shuffle playlist
  React.useEffect(() => {
    if (playlist.length === 0) {
      return;
    }

    if (shuffle) {
      dispatch(setPlaylist(lodashShuffle(playlist)));
      return;
    }

    dispatch(setPlaylist(songList));
  }, [shuffle]);

  // play next song if ended and toggle repeat many
  React.useEffect(() => {
    const songEnded = playerState.time === playerState.duration;
    if (isPlaying && songEnded) {
      dispatch({ type: PlayerActionType.PLAY_NEXT });
    }
  }, [playerState.time, playerState.duration]);

  const handleVolumeButtonClick = () => {
    playerControls[playerState.muted ? 'unmute' : 'mute']();
  };

  return (
    <Wrapper>
      <Head>
        <title>{isPlaying ? `${nowPlaying?.author} - ${nowPlaying?.title}` : 'Moosik'}</title>
      </Head>
      <PlayerContainer>
        <ControlsGroup>
          <PrevButton />
          <PlayPauseButton />
          <NextButton />
          <RepeatButton />
          <ShuffleButton />
        </ControlsGroup>
        <Timeline
          timePassed={playerState.time}
          duration={Number.isFinite(playerState.duration) ? playerState.duration : undefined}
          onTimeChanged={playerControls.seek}
        />
        <VolumeControlWrapper
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <VolumeButton muted={playerState.muted} onClick={handleVolumeButtonClick} />
          {!isMobile() && (
            <VolumeSlider
              show={showVolumeSlider}
              value={playerState.volume}
              onVolumeChange={playerControls.volume}
            />
          )}
        </VolumeControlWrapper>
        <SoundBadge
          author={nowPlaying?.author}
          title={nowPlaying?.title}
          cover={nowPlaying?.cover}
        />
        {audio}
      </PlayerContainer>
    </Wrapper>
  );
};

export default Player;
