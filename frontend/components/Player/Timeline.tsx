import dayjs from 'dayjs';
import React, { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

const TimelineWrapper = styled.div`
  display: flex;
  margin: 0 10px;
  flex: 1;
`;

const TimelineContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 10px;
  flex: 1;
  cursor: pointer;
`;

const TimeSpan = styled.span`
  display: inline-flex;
  align-items: center;
  color: #c7ccd8;
  font-size: 0.875rem;
`;

const TimelineProrgessBackground = styled.div`
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  background: #c7ccd8;
`;

interface TimelineProps {
  progress: number;
}

const TimelineProrgessForeground = styled.div.attrs((props: TimelineProps) => ({
  style: { width: `${100 * props.progress}%` },
}))<TimelineProps>`
  min-width: 0;
  max-width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  background: #4f82d1;
`;

const TimelineProrgessHandle = styled.div.attrs((props: TimelineProps) => ({
  style: { left: `${100 * props.progress}%` },
}))<TimelineProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  margin-left: -4px;
  background: #4f82d1;
  border-radius: 4px;
`;

const Timeline: React.FC<{ time: number; duration: number; onChange: (value: number) => void }> = ({
  time,
  duration,
  onChange,
}) => {
  const [progress, setProgress] = useState(time / duration);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (!drag) {
      setProgress(time / duration);
    }
  }, [time, duration]);

  const getProgress = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    return (event.clientX - left) / width;
  };

  return (
    <TimelineWrapper>
      <TimeSpan>{dayjs(time * 1000).format('mm:ss')}</TimeSpan>
      <TimelineContainer
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={time}
        onMouseDown={(event) => setDrag(event.button === 0)}
        onMouseMove={(event) => {
          if (drag) {
            setProgress(getProgress(event));
          }
        }}
        onMouseUp={(event) => {
          if (event.button === 0) {
            const currentProgress = getProgress(event);
            setProgress(currentProgress);

            onChange(duration * currentProgress);
            setDrag(false);
          }
        }}
        onMouseLeave={() => {
          if (drag) {
            onChange(duration * progress);
            setDrag(false);
          }
        }}
      >
        <TimelineProrgessBackground />
        <TimelineProrgessForeground progress={progress} />
        <TimelineProrgessHandle progress={progress} />
      </TimelineContainer>
      <TimeSpan>{dayjs(duration * 1000).format('mm:ss')}</TimeSpan>
    </TimelineWrapper>
  );
};

export default Timeline;
