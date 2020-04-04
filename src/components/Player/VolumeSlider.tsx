import { useState } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import {
  TransitionStatus, ENTERING, ENTERED, EXITING, EXITED,
} from 'react-transition-group/Transition';
import { Theme } from '../ThemeProvider';

const Wrapper = styled.div`
  width: 24px;
  height: 116px;
  position: absolute;
  bottom: 36px;
  right: 0;
  padding: 8px;
  background: ${(props: Theme) => props.theme.colors.light};
  box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.dark};
  z-index: 1;
`;

type AnimationProps = Theme<{ state: TransitionStatus }>;

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
  user-select: none;
`;

const VolumeBar = styled.div`
  width: 2px;
  height: 100%;
  position: absolute;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.gray};
`;

type VolumeBarProps = Theme<{ percent: number }>;

const VolumeBarActive = styled.div.attrs(
  (props: VolumeBarProps) => ({ style: { height: `${props.percent}%` } }),
)<VolumeBarProps>`
  width: 2px;
  min-height: 0px;
  max-height: 100%;
  position: absolute;
  bottom: 0;
  background: ${(props: Theme) => props.theme.colors.red};
`;

const VolumeBarHandle = styled.div.attrs(
  (props: VolumeBarProps) => ({ style: { bottom: `${92 * (props.percent / 100)}%` } }),
)<VolumeBarProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  border-radius: 100%;
  background: ${(props: VolumeBarProps) => props.theme.colors.red};
`;

interface VolumeSliderProps {
  show?: boolean;
  value: number;
  handler: (volume: number) => void;
}

const VolumeSlider = ({ show = false, value, handler } : VolumeSliderProps) => {
  const [isLeftMouseButtonPressed, setIsLeftMouseButtonPressed] = useState(false);

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
            onMouseDown={(event) => {
              if (event.button === 0) {
                setIsLeftMouseButtonPressed(true);
              }
            }}
            onMouseMove={(event) => {
              if (isLeftMouseButtonPressed) {
                const { top, height } = event.currentTarget.getBoundingClientRect();
                handler(1 - (event.clientY - top) / height);
              }
            }}
            onMouseUp={(event) => {
              if (event.button === 0) {
                const { top, height } = event.currentTarget.getBoundingClientRect();
                handler(1 - (event.clientY - top) / height);

                setIsLeftMouseButtonPressed(false);
              }
            }}
            onMouseLeave={(event) => {
              if (isLeftMouseButtonPressed) {
                const { top, height } = event.currentTarget.getBoundingClientRect();
                handler(1 - (event.clientY - top) / height);

                setIsLeftMouseButtonPressed(false);
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
