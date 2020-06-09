import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Head from 'next/head';
import { useAudio } from 'react-use';
import isMobile from 'is-mobile';
import _shuffle from 'lodash/shuffle';
import useRequest from '@hooks/useRequest';
import {
  setSongList,
  setCurrentSong,
  setPlaying,
  setCurrentSongIndex,
} from '@redux/player/actions';
import { Song, SongDetails, RepeatTypes } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Theme } from '@components/ThemeProvider';
import PrevButton from './Controls/Prev';
import PlayPauseButton from './Controls/PlayPause';
import NextButton from './Controls/Next';
import RepeatButton from './Controls/Repeat';
import ShuffleButton from './Controls/Shuffle';
import Timeline from './Timeline';
import VolumeButton from './Controls/Volume';
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

type CurrentSong = { song: SongDetails | null, index: number };

const Player = () => {
  const [defaultSongList, setDefaultSongList] = useState<Song[]>([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const playing = useSelector<RootState, boolean>(
    (state) => state.player.playing,
  );

  const songList = useSelector<RootState, Song[]>(
    (state) => state.player.songList,
  );

  const { song, index } = useSelector<RootState, CurrentSong>(
    (state) => state.player.current,
  );

  const repeat = useSelector<RootState, RepeatTypes>(
    (state) => state.player.repeat,
  );

  const shuffle = useSelector<RootState, boolean>(
    (state) => state.player.shuffle,
  );

  const dispatch = useDispatch();

  const [audio, playerState, playerControls, ref] = useAudio({
    crossOrigin: 'anonymous',
    preload: 'auto',
    src: song?.url || '',
    autoPlay: false,
  });

  const { authRequest } = useRequest();

  useEffect(() => {
    if (playing) {
      playerControls.play();
      return;
    }

    playerControls.pause();
  }, [song, playing]);

  useEffect(() => {
    const getSong = async () => {
      const newSong = songList[index];
      if (!newSong) {
        return;
      }

      const res = await authRequest(`/songs/${newSong.uuid}`);

      dispatch(setCurrentSong(res.data.song));
      dispatch(setPlaying(true));
    };

    getSong();
  }, [index]);

  useEffect(() => {
    if (ref.current) {
      ref.current.loop = repeat === 'single';
    }
  }, [repeat]);

  useEffect(() => {
    if (shuffle) {
      setDefaultSongList(songList);

      const shuffledSongList = _shuffle(songList);
      dispatch(setSongList(shuffledSongList));
      dispatch(setCurrentSongIndex(-1));

      return;
    }

    if (defaultSongList.length === 0) {
      return;
    }

    dispatch(setSongList(defaultSongList));
    setDefaultSongList([]);
  }, [shuffle]);

  useEffect(() => {
    if (playerState.time === playerState.duration && songList.length && index < songList.length) {
      dispatch(setCurrentSongIndex(index + 1));
    }
  }, [playerState.time, playerState.duration]);

  const toggleVolume = () => {
    if (playerState.muted) {
      playerControls.unmute();
      return;
    }

    playerControls.mute();
  };

  return (
    <Wrapper>
      <Head>
        <title>{playing ? `${song?.author} - ${song?.title}` : 'Moosik'}</title>
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
          <VolumeButton muted={playerState.muted} onClick={toggleVolume} />
          {!isMobile() && (
            <VolumeSlider
              show={showVolumeSlider}
              value={playerState.volume}
              onVolumeChange={playerControls.volume}
            />
          )}
        </VolumeControlWrapper>
        <SoundBadge author={song?.author} title={song?.title} cover={song?.cover} />
        {audio}
      </PlayerContainer>
    </Wrapper>
  );
};

export default Player;
