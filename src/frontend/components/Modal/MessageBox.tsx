import { Theme } from '@components/ThemeProvider';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import Transition, { ENTERED, EXITED, TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import ErrorIcon from './Icons/Error';

type MessageType = 'error';

type ContainerProps = Theme<{
  messageType: MessageType;
}>;

const getBorderColor = (props: ContainerProps) => {
  switch (props.messageType) {
    case 'error':
      return props.theme.modal.icons.error;
    default:
      return props.theme.modal.text;
  }
};

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  max-width: 640px;
  min-width: 256px;
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 8px;
  background: ${(props: Theme) => props.theme.modal.background};
  border-left: ${getBorderColor} solid 3px;
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
  pointer-events: auto;

  @media (max-width: 640px) {
    & {
      max-width: calc(100vw - 40px);
    }
  }
`;

interface AnimatedContainerProps extends ContainerProps {
  state: TransitionStatus;
}

export const AnimatedContainer = styled(Container)<AnimatedContainerProps>`
  transition: 200ms;
  transform: translateX(
    ${(props: AnimatedContainerProps) =>
      props.state === EXITED || props.state === ENTERED ? 0 : 400}px
  );
`;

const TextContainer = styled.div`
  padding: 4px 16px;
  color: ${(props: Theme) => props.theme.modal.text};
  font-size: 16px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  flex: 1;
`;

interface MessageBoxProps {
  type: MessageType;
  text: string;
  timeout?: number;
  onHide: () => void;
}

const MessageBox = ({ text, type, timeout = 5000, onHide }: MessageBoxProps) => {
  const [animationStart, setAnimationStart] = useState(false);

  const hideMessageBox = useCallback(
    debounce(() => {
      setAnimationStart(false);
      onHide();
    }, timeout),
    [],
  );

  useEffect(() => {
    setAnimationStart(true);
    hideMessageBox();
  }, []);

  const cancelHideMessageBox = () => {
    hideMessageBox.cancel();
  };

  return (
    <Transition in={animationStart} type="ease" timeout={200}>
      {(state) => (
        <AnimatedContainer
          messageType={type}
          state={state}
          onMouseEnter={cancelHideMessageBox}
          onMouseLeave={hideMessageBox}
        >
          {type === 'error' && <ErrorIcon />}
          <TextContainer>
            <span>{text}</span>
          </TextContainer>
        </AnimatedContainer>
      )}
    </Transition>
  );
};

export default MessageBox;
