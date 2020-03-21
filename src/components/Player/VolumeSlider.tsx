import { useState } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import {
  TransitionStatus, ENTERING, ENTERED, EXITING, EXITED,
} from 'react-transition-group/Transition';
import { ThemeProps } from '../ThemeProvider';

const Wrapper = styled.div`
  width: 24px;
  height: 116px;
  position: absolute;
  bottom: 36px;
  right: 0;
  padding: 8px;
  background: ${(props: ThemeProps) => props.theme.colors.light};
  box-shadow: 0 0 2px ${(props: ThemeProps) => props.theme.colors.dark};
  z-index: 1;
`;

type AnimationProps = ThemeProps<{ state: TransitionStatus }>;

const translateYFunc = (state: TransitionStatus): number => {
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

const opacityFunc = (state: TransitionStatus): number => {
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
  transform: translateY(${(props: AnimationProps) => translateYFunc(props.state)}%);
  opacity: ${(props: AnimationProps) => opacityFunc(props.state)};

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
`;

const VolumeBar = styled.div`
  width: 2px;
  height: 100%;
  position: absolute;
  bottom: 0;
  background: ${(props: ThemeProps) => props.theme.colors.gray};
`;

type VolumeBarProps = ThemeProps<{ percent: number }>;

const VolumeActiveBar = styled.div<VolumeBarProps>`
  width: 2px;
  height: ${(props: VolumeBarProps) => props.percent}%;
  position: absolute;
  bottom: 0;
  background: ${(props: ThemeProps) => props.theme.colors.red};
  transition: height ${(props: ThemeProps) => props.theme.transition};
`;

const VolumeSliderHandle = styled.div<VolumeBarProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  bottom: ${(props: VolumeBarProps) => 92 * (props.percent / 100)}%;
  border-radius: 100%;
  background: ${(props: ThemeProps) => props.theme.colors.red};
`;

interface VolumeSliderProps {
  show?: boolean;
  value: number;
  handler: (value: number) => void;
}

const VolumeSlider = ({ show = false, value, handler } : VolumeSliderProps) => {
  const [volume, setVolume] = useState(value);

  const updateVolume = (newValue: number) => {
    handler(newValue);
    setVolume(newValue);
  };

  const percent = 100 * volume;

  return (
    <Transition
      in={show}
      mountOnEnter
      unmountOnExit
      timeout={200}
    >
      {(state) => (
        <Animation state={state}>
          <Slider
            role="slider"
            aria-valuemax={1}
            aria-valuemin={0}
            aria-valuenow={value}
            tabIndex={-1}
            onKeyDown={null}
            onClick={(event) => {
              const el = event.currentTarget.getBoundingClientRect();
              updateVolume(1 - (event.clientY - el.top) / el.height);
            }}
          >
            <VolumeBar />
            <VolumeActiveBar percent={percent} />
            <VolumeSliderHandle percent={percent} />
          </Slider>
        </Animation>
      )}
    </Transition>
  );
};

export default VolumeSlider;
