import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Head from 'next/head';
import { useAudio } from 'react-use';
import isMobile from 'is-mobile';
import lodashShuffle from 'lodash/shuffle';
import useRequest from '@hooks/useRequest';
import {
  setSongList,
  setCurrentSong,
  setPlaying,
  setCurrentSongIndex,
  setShuffle,
} from '@redux/player/actions';
import { Song, SongDetails } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Theme } from '@components/ThemeProvider';
import Control from './PlayerControl';
import PlayPauseButton from './PlayPauseButton';
import Timeline from './Timeline';
import VolumeSlider from './VolumeSlider';
import SoundBadge from './SoundBadge';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.background};
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

const SvgPaths = {
  Volume: () => (
    <path
      d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,
        19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,
        7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
    />
  ),
  Mute: () => (
    <path
      d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,
        17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,
        18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,
        14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,
        3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,
        7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
    />
  ),
  Shuffle: () => (
    <path
      d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,
        13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,
        4L4,5.41L9.17,10.58L10.59,9.17Z"
    />
  ),
};

const Player = () => {
  const [defaultSongList, setDefaultSongList] = useState<Song[]>([]);
  const [loop, setLoop] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const { authRequest } = useRequest();

  const dispatch = useDispatch();

  const playing = useSelector<RootState, boolean>(
    (state) => state.player.playing,
  );

  const songList = useSelector<RootState, Song[]>(
    (state) => state.player.songList,
  );

  const {
    song: currentSong, index: currentSongIndex,
  } = useSelector<RootState, { song: SongDetails | null, index: number }>(
    (state) => state.player.current,
  );

  const shuffle = useSelector<RootState, boolean>(
    (state) => state.player.shuffle,
  );

  const [audio, playerState, playerControls, ref] = useAudio({
    crossOrigin: 'anonymous',
    preload: 'auto',
    src: currentSong?.url || '',
    autoPlay: false,
  });

  const ended = () => dispatch(setPlaying(false));

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('ended', ended);
    }

    return () => {
      ref.current!.removeEventListener('ended', ended);
    };
  }, [ref.current]);

  useEffect(() => {
    if (playing) {
      playerControls.play();
      return;
    }

    playerControls.pause();
  }, [playing, currentSong]);

  useEffect(() => {
    const getSong = async () => {
      const song = songList[currentSongIndex];
      if (!song) {
        return;
      }

      const res = await authRequest(`/songs/${song.uuid}`);

      dispatch(setCurrentSong(res.data.song));
      dispatch(setPlaying(true));
    };

    getSong();
  }, [currentSongIndex]);

  useEffect(() => {
    if (ref.current) {
      ref.current.loop = loop;
    }
  }, [loop]);

  useEffect(() => {
    if (shuffle) {
      setDefaultSongList(songList);

      const shuffledSongList = lodashShuffle(songList);
      dispatch(setSongList(shuffledSongList));

      return;
    }

    dispatch(setSongList(defaultSongList));
  }, [shuffle]);

  return (
    <Wrapper>
      <Head>
        <title>{playing ? `${currentSong?.author} - ${currentSong?.title}` : 'Moosik'}</title>
      </Head>
      <PlayerContainer>
        <ControlsGroup>
          <Control
            caption="Prev"
            handler={() => {
              if (currentSongIndex > 0) {
                dispatch(setCurrentSongIndex(currentSongIndex - 1));
              }
            }}
          >
            <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
          </Control>
          <PlayPauseButton />
          <Control
            caption="Next"
            handler={() => {
              if (currentSongIndex < songList.length - 1) {
                dispatch(setCurrentSongIndex(currentSongIndex + 1));
              }
            }}
          >
            <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
          </Control>
          <Control
            caption="Repeat"
            active={ref.current?.loop || false}
            handler={() => {
              setLoop(!loop);
            }}
          >
            <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
          </Control>
          <Control
            caption="Shuffle"
            handler={() => {
              dispatch(setShuffle(!shuffle));
            }}
          >
            <SvgPaths.Shuffle />
          </Control>
        </ControlsGroup>
        <Timeline
          timePassed={playerState.time}
          duration={Number.isFinite(playerState.duration) ? playerState.duration : 0}
          handler={playerControls.seek}
        />
        <VolumeControlWrapper
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <Control
            caption="Volume"
            handler={() => {
              if (playerState.muted) {
                playerControls.unmute();
                return;
              }

              playerControls.mute();
            }}
          >
            {playerState.muted ? <SvgPaths.Mute /> : <SvgPaths.Volume />}
          </Control>
          {!isMobile() && (
            <VolumeSlider
              show={showVolumeSlider}
              value={playerState.volume}
              handler={playerControls.volume}
            />
          )}
        </VolumeControlWrapper>
        <SoundBadge
          author={currentSong?.author}
          title={currentSong?.title}
          cover={currentSong?.cover}
        />
        {audio}
      </PlayerContainer>
    </Wrapper>
  );
};

export default Player;
