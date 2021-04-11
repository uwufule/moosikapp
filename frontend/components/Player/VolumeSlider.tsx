import React, { MouseEvent, useState } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import styled from 'styled-components';
import PlayerControl from './Controls/PlayerControl';

const VolumeWrapper = styled.div`
  position: relative;
`;

const VolumeControl: React.FC<{ muted: boolean; onClick: () => void }> = ({ muted, onClick }) => (
  <PlayerControl onClick={onClick}>
    {muted ? (
      <path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z" />
    ) : (
      <path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z" />
    )}
  </PlayerControl>
);

const VolumeSliderWrapper = styled.div<{ status: TransitionStatus }>`
  width: 40px;
  height: 150px;
  position: absolute;
  left: -50%;
  bottom: 100%;
  padding: 10px 0;
  background: #1b1d27;
  box-shadow: 0 0 2px #000;
  box-sizing: border-box;
  opacity: ${(props) => (props.status === 'entered' ? 1 : 0)};
  transition: 200ms ease all;
`;

const VolumeSliderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
`;

const VolumeSliderBackground = styled.div`
  width: 2px;
  height: 100%;
  position: absolute;
  background: #c7ccd8;
`;

interface VolumeSliderProps {
  value: number;
}

const VolumeSliderForeground = styled.div.attrs((props: VolumeSliderProps) => ({
  style: { height: `${100 * props.value}%` },
}))<VolumeSliderProps>`
  width: 2px;
  min-height: 0;
  max-height: 100%;
  position: absolute;
  bottom: 0;
  background: #4f82d1;
`;

const VolumeSliderHandle = styled.div.attrs((props: VolumeSliderProps) => ({
  style: { bottom: `${100 * props.value}%` },
}))<VolumeSliderProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  margin-bottom: -4px;
  background: #4f82d1;
  border-radius: 4px;
`;

const VolumeSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  onClick: () => void;
}> = ({ value, onClick, onChange }) => {
  const [flag, setFlag] = useState(false);
  const [drag, setDrag] = useState(false);

  const getVolume = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const { top, height } = event.currentTarget.getBoundingClientRect();
    return 1 - (event.clientY - top) / height;
  };

  return (
    <VolumeWrapper onMouseEnter={() => setFlag(true)} onMouseLeave={() => setFlag(false)}>
      <VolumeControl muted={value === 0} onClick={onClick} />
      <Transition in={flag} mountOnEnter unmountOnExit type="ease" timeout={200}>
        {(status) => (
          <VolumeSliderWrapper status={status}>
            <VolumeSliderContainer
              role="slider"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={value}
              onMouseDown={(event) => setDrag(event.button === 0)}
              onMouseUp={(event) => {
                if (drag) {
                  onChange(getVolume(event));
                  setDrag(false);
                }
              }}
              onMouseMove={(event) => {
                if (drag) {
                  onChange(getVolume(event));
                }
              }}
              onMouseLeave={(event) => {
                if (drag) {
                  onChange(getVolume(event));
                  setDrag(false);
                }
              }}
            >
              <VolumeSliderBackground />
              <VolumeSliderForeground value={value} />
              <VolumeSliderHandle value={value} />
            </VolumeSliderContainer>
          </VolumeSliderWrapper>
        )}
      </Transition>
    </VolumeWrapper>
  );
};

export default VolumeSlider;
