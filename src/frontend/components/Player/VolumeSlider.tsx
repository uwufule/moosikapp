import { useState, MouseEvent } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import {
  TransitionStatus, ENTERING, ENTERED, EXITING, EXITED,
} from 'react-transition-group/Transition';
import { Theme } from '@components/ThemeProvider';

type Event = MouseEvent<HTMLDivElement, globalThis.MouseEvent>;

const Wrapper = styled.div`
  width: 24px;
  height: 116px;
  position: absolute;
  bottom: 36px;
  right: 0;
  padding: 8px;
  background: ${(props: Theme) => props.theme.colors.background};
  box-shadow: ${(props: Theme) => props.theme.shadow.short};
  z-index: 1;
`;

type AnimationProps = Theme<{ state: TransitionStatus }>;

const translateY = (state: TransitionStatus): number => {
  switch (state) {
    case ENTERING:
      return 25;
    case ENTERED:
      return 0;
    case EXITING:
      return 25;
    case EXITED:
    default:
      return 0;
  }
};

const opacity = (state: TransitionStatus): number => {
  switch (state) {
    case ENTERING:
      return 0;
    case ENTERED:
      return 1;
    case EXITING:
      return 0;
    case EXITED:
    default:
      return 1;
  }
};

const Animation = styled(Wrapper)<AnimationProps>`
  transform: translateY(${(props: AnimationProps) => translateY(props.state)}%);
  opacity: ${(props: AnimationProps) => opacity(props.state)};
  transition: ${(props: AnimationProps) => props.theme.transition};
`;

const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100px;
  position: relative;
  outline: 0;
  cursor: pointer;
  user-select: none;
`;

const VolumeBar = styled.div`
  width: 2px;
  height: 100%;
  position: absolute;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.secondary};
`;

type VolumeBarProps = Theme<{ percent: number }>;

const setHeight = (props: VolumeBarProps) => ({
  style: {
    height: `${props.percent}%`,
  },
});
const VolumeBarActive = styled.div.attrs(setHeight)<VolumeBarProps>`
  width: 2px;
  min-height: 0px;
  max-height: 100%;
  position: absolute;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.accent};
`;

const setBottom = (props: VolumeBarProps) => ({
  style: {
    bottom: `${92 * (props.percent / 100)}%`,
  },
});
const VolumeBarHandle = styled.div.attrs(setBottom)<VolumeBarProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  border-radius: 100%;
  background: ${(props: VolumeBarProps) => props.theme.colors.accent};
`;

interface VolumeSliderProps {
  show?: boolean;
  value: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeSlider = ({ show = false, value, onVolumeChange } : VolumeSliderProps) => {
  const [dragStart, setDragStart] = useState(false);

  const getVolumePercents = (event: Event) => {
    const { top, height } = event.currentTarget.getBoundingClientRect();
    return 1 - (event.clientY - top) / height;
  };

  const percent = 100 * value;

  return (
    <Transition in={show} mountOnEnter unmountOnExit timeout={200}>
      {(state) => (
        <Animation state={state}>
          <Slider
            role="slider"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={value}
            onMouseDown={(event) => setDragStart(event.button === 0)}
            onMouseMove={(event) => {
              if (dragStart) {
                onVolumeChange(getVolumePercents(event));
              }
            }}
            onMouseUp={(event) => {
              if (dragStart) {
                onVolumeChange(getVolumePercents(event));

                setDragStart(false);
              }
            }}
            onMouseLeave={(event) => {
              if (dragStart) {
                onVolumeChange(getVolumePercents(event));

                setDragStart(false);
              }
            }}
          >
            <VolumeBar />
            <VolumeBarActive percent={percent} />
            <VolumeBarHandle percent={percent} />
          </Slider>
        </Animation>
      )}
    </Transition>
  );
};

export default VolumeSlider;
