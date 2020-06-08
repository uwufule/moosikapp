import { useState, useEffect, MouseEvent } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Theme } from '@components/ThemeProvider';

type Event = MouseEvent<HTMLDivElement, globalThis.MouseEvent>;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  flex: 1;

  @media (max-width: 480px) {
    & {
      padding: 12px 0;
    }
  }
`;

const Time = styled.span`
  font-size: 14px;
  line-height: 16px;
  color: ${(props: Theme) => props.theme.colors.primary};
`;

const PropgressWrapper = styled.div`
  position: relative;
  height: 16px;
  margin: 0 10px;
  padding: 7px 0;
  outline: 0;
  cursor: pointer;
  user-select: none;
  flex: 1;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  position: absolute;
  background: ${(props: Theme) => props.theme.colors.secondary};
`;

type ProgressBarProps = Theme<{ percent: number }>;

const setWidth = (props: ProgressBarProps) => ({ style: { width: `${props.percent}%` } });
const ProgressBarActive = styled.div.attrs(setWidth)<ProgressBarProps>`
  min-width: 0px;
  max-width: 100%;
  height: 2px;
  position: absolute;
  background: ${(props: ProgressBarProps) => props.theme.colors.accent};
`;

const setLeft = (props: ProgressBarProps) => ({ style: { left: `${props.percent}%` } });
const ProgressBarHandle = styled.div.attrs(setLeft)<ProgressBarProps>`
  width: 8px;
  height: 8px;
  position: absolute;
  margin: -3px -3px 0 0 ;
  border-radius: 100%;
  background: ${(props: ProgressBarProps) => props.theme.colors.accent};
`;

interface TimelineProps {
  timePassed?: number;
  duration?: number;
  onTimeChanged: (time: number) => void;
}

const Timeline = ({ timePassed = 0, duration = 0, onTimeChanged }: TimelineProps) => {
  const [currentTime, setCurrentTime] = useState(timePassed);
  const [dragStart, setDragStart] = useState(false);

  useEffect(() => {
    if (!dragStart) {
      setCurrentTime(timePassed);
    }
  }, [timePassed]);

  const getPassedPercents = (event: Event) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    return (event.clientX - left) / width;
  };

  const percent = 100 * (currentTime / duration);

  return (
    <Wrapper>
      <Time>{dayjs(currentTime * 1000).format('mm:ss')}</Time>
      <PropgressWrapper
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={timePassed}
        onMouseDown={(event) => setDragStart(event.button === 0)}
        onMouseMove={(event) => {
          if (dragStart) {
            setCurrentTime(duration * getPassedPercents(event));
          }
        }}
        onMouseUp={(event) => {
          if (event.button === 0) {
            const time = duration * getPassedPercents(event);
            setCurrentTime(time);
            onTimeChanged(time);

            setDragStart(false);
          }
        }}
        onMouseLeave={() => {
          if (dragStart) {
            onTimeChanged(currentTime);

            setDragStart(false);
          }
        }}
      >
        <ProgressBar />
        <ProgressBarActive percent={percent} />
        <ProgressBarHandle percent={percent} />
      </PropgressWrapper>
      <Time>{dayjs(duration * 1000).format('mm:ss')}</Time>
    </Wrapper>
  );
};

export default Timeline;
