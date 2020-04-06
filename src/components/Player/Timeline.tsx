import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Theme } from '../ThemeProvider';

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

const ProgressBarActive = styled.div.attrs(
  (props: ProgressBarProps) => ({ style: { width: `${props.percent}%` } }),
)<ProgressBarProps>`
  min-width: 0px;
  max-width: 100%;
  height: 2px;
  position: absolute;
  background: ${(props: ProgressBarProps) => props.theme.colors.accent};
  transition: background-color ${(props: ProgressBarProps) => props.theme.transition};
`;

const ProgressBarHandle = styled.div.attrs(
  (props: ProgressBarProps) => ({ style: { left: `${props.percent}%` } }),
)<ProgressBarProps>`
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
  handler: (time: number) => void;
}

const Timeline = ({ timePassed = 0, duration = 0, handler }: TimelineProps) => {
  const [currentTime, setCurrentTime] = useState(timePassed);
  const [isLeftMouseButtonPressed, setIsLeftMouseButtonPressed] = useState(false);

  useEffect(() => {
    if (!isLeftMouseButtonPressed) {
      setCurrentTime(timePassed);
    }
  }, [timePassed]);

  const percent = 100 * (currentTime / duration);

  return (
    <Wrapper>
      <Time>{moment(currentTime * 1000).format('mm:ss')}</Time>
      <PropgressWrapper
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={timePassed}
        onMouseDown={(event) => {
          if (event.button === 0) {
            setIsLeftMouseButtonPressed(true);
          }
        }}
        onMouseMove={(event) => {
          if (isLeftMouseButtonPressed) {
            const { left, width } = event.currentTarget.getBoundingClientRect();
            setCurrentTime((duration * (event.clientX - left)) / width);
          }
        }}
        onMouseUp={(event) => {
          if (event.button === 0) {
            const { left, width } = event.currentTarget.getBoundingClientRect();
            const time = (duration * (event.clientX - left)) / width;
            handler(time);
            setCurrentTime(time);

            setIsLeftMouseButtonPressed(false);
          }
        }}
        onMouseLeave={() => {
          if (isLeftMouseButtonPressed) {
            handler(currentTime);
            setIsLeftMouseButtonPressed(false);
          }
        }}
      >
        <ProgressBar />
        <ProgressBarActive percent={percent} />
        <ProgressBarHandle percent={percent} />
      </PropgressWrapper>
      <Time>{moment(duration * 1000).format('mm:ss')}</Time>
    </Wrapper>
  );
};

export default Timeline;
