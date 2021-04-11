import isMobile from 'is-mobile';
import Head from 'next/head';
import React, { createRef, memo, RefObject, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAudio } from 'react-use';
import styled, { css } from 'styled-components';
import { playNext } from '../../redux/player/actions';
import { selectCurrentSong, selectPlaying, selectRepeat } from '../../redux/player/selectors';
import Next from './Controls/Next';
import PlayPause from './Controls/PlayPause';
import Prev from './Controls/Prev';
import Repeat from './Controls/Repeat';
import Shuffle from './Controls/Shuffle';
import SongBadge from './SongBadge';
import Timeline from './Timeline';
import VolumeSlider from './VolumeSlider';

const PlayerWrapper = styled.div`
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #1b1d27;
  box-shadow: 0 0 2px #000;
  z-index: 10;
`;

const PlayerContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;

  ${isMobile() &&
  css`
    flex-direction: column;
    height: 100px;
  `}
`;

const PlayerControlsGroup = styled.div`
  ${isMobile() &&
  css`
    display: flex;
    justify-content: space-between;
  `}
`;

// const AudioComponent: React.FC<{ songUrl?: string; ref?: RefObject<HTMLAudioElement> }> = memo(
//   ({ songUrl, ref }) => {
//     return (
//       <audio ref={ref} crossOrigin="anonymous" preload="auto" autoPlay={false} src={songUrl} />
//     );
//   },
// );

const Player: React.FC = () => {
  const currentSong = useSelector(selectCurrentSong);
  const playing = useSelector(selectPlaying);
  const repeat = useSelector(selectRepeat);

  const dispatch = useDispatch();

  const [AudioComponent, state, controls, ref] = useAudio({
    src: currentSong?.url ?? '',
    crossOrigin: 'anonymous',
    preload: 'auto',
    autoPlay: false,
  });

  useEffect(() => {
    controls[playing ? 'play' : 'pause']();
  }, [currentSong, playing]);

  useEffect(() => {
    if (ref.current) {
      ref.current.loop = repeat === 'single';
    }
  }, [repeat]);

  useEffect(() => {
    if (state.time !== 0 && state.time === state.duration) {
      dispatch(playNext());
    }
  }, [state.time, state.duration]);

  const toggleMuted = () => {
    controls[state.muted ? 'unmute' : 'mute']();
  };

  return (
    <PlayerWrapper>
      {playing && (
        <Head>
          <title>
            {currentSong?.author} - {currentSong?.title}
          </title>
        </Head>
      )}
      {AudioComponent}
      <PlayerContainer>
        <PlayerControlsGroup>
          <Prev />
          <PlayPause />
          <Next />
          <Shuffle />
          <Repeat />
        </PlayerControlsGroup>
        <Timeline time={state.time} duration={state.duration} onChange={controls.seek} />
        {!isMobile() && (
          <>
            <PlayerControlsGroup>
              <VolumeSlider
                value={state.muted ? 0 : state.volume}
                onChange={controls.volume}
                onClick={toggleMuted}
              />
            </PlayerControlsGroup>
            <SongBadge
              author={currentSong?.author}
              title={currentSong?.title}
              coverUrl={currentSong?.cover}
            />
          </>
        )}
      </PlayerContainer>
    </PlayerWrapper>
  );
};

export default Player;
