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
  color: ${(props: Theme) => props.theme.colors.dark};
`;

const PropgressWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 6px;
    height: 14px;
    flex: 1;
    outline: 0;
    cursor: pointer;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  background: ${(props: Theme) => props.theme.colors.gray};
`;

type ProgressActiveProps = Theme<{ percent: number }>;

const ProgressActive = styled.div<ProgressActiveProps>`
  width: ${(props: ProgressActiveProps) => (
    props.percent > 100 ? 100 : props.percent
  )}%;
  height: 100%;
  background: ${(props: ProgressActiveProps) => props.theme.colors.red};
  transition: background-color ${(props: ProgressActiveProps) => props.theme.transition};
`;

interface TimelineProps {
  timePassed?: number;
  duration?: number;
  handler: (event: number) => void;
}

const Timeline = ({ timePassed = 0, duration = 0, handler }: TimelineProps) => (
  <Wrapper>
    <Time>{moment(timePassed * 1000).format('mm:ss')}</Time>
    <PropgressWrapper
      role="slider"
      aria-valuemax={duration}
      aria-valuemin={0}
      aria-valuenow={timePassed}
      tabIndex={-1}
      onKeyDown={null}
      onClick={(event) => {
        const el = event.currentTarget.getBoundingClientRect();
        handler((duration * (event.clientX - el.left)) / el.width);
      }}
    >
      <ProgressBar>
        <ProgressActive percent={100 * (timePassed / duration)} />
      </ProgressBar>
    </PropgressWrapper>
    <Time>{moment(duration * 1000).format('mm:ss')}</Time>
  </Wrapper>
);

export default Timeline;
