import { useState } from 'react';
import styled from 'styled-components';
import isMobile from 'is-mobile';
import Control from './PlayerControl';
import Timeline from './Timeline';
import VolumeSlider from './VolumeSlider';
import SoundBadge from './SoundBadge';
import { Theme } from '../ThemeProvider';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.light};
  box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.dark};
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
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);

  return (
    <Wrapper>
      <PlayerContainer>
        <ControlsGroup>
          <Control caption="Prev" handler={() => {}}>
            <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
          </Control>
          <Control caption="Play / Pause" handler={() => {}}>
            {false
              ? <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              : <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />}
          </Control>
          <Control caption="Next" handler={() => {}}>
            <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
          </Control>
          <Control caption="Repeat" handler={() => {}}>
            <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
          </Control>
          <Control caption="Shuffle" handler={() => {}}>
            <path
              d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,
                13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,
                4L4,5.41L9.17,10.58L10.59,9.17Z"
            />
          </Control>
        </ControlsGroup>
        <Timeline timePassed={1} duration={10} handler={() => {}} />
        <VolumeControlWrapper
          onMouseEnter={() => setIsVolumeSliderVisible(true)}
          onMouseLeave={() => setIsVolumeSliderVisible(false)}
        >
          <Control caption="Volume" handler={() => {}}>
            {false
              ? (
                <path
                  d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,
                    17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,
                    18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,
                    14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,
                    3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,
                    7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                />
              ) : (
                <path
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,
                    19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,
                    7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              )}
          </Control>
          {!isMobile() && (
            <VolumeSlider show={isVolumeSliderVisible} value={1} handler={() => {}} />
          )}
        </VolumeControlWrapper>
        <SoundBadge author="Song Author" title="Song Title" />
      </PlayerContainer>
    </Wrapper>
  );
};

export default Player;
