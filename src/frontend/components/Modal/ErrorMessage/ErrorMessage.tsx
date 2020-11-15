import { Theme } from '@components/ThemeProvider';
import { hideErrorMessage } from '@redux/modal/actions';
import { selectErrorMessage } from '@redux/modal/selectors';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Transition, { ENTERED, EXITED, TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import ErrorIcon from './ErrorIcon';

const Container = styled.div`
  display: flex;
  align-items: center;
  max-width: 640px;
  min-width: 256px;
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 8px;
  background: ${(props: Theme) => props.theme.errorModal.background};
  border-left-width: 3px;
  border-left-style: solid;
  border-left-color: ${(props: Theme) => props.theme.errorModal.icon};
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
  pointer-events: auto;

  @media (max-width: 640px) {
    & {
      max-width: calc(100vw - 40px);
    }
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 16px;
  color: ${(props: Theme) => props.theme.errorModal.text};
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  /* white-space: nowrap; */
  flex: 1;
`;

interface AnimatedComponentProps {
  state: TransitionStatus;
}

export const AnimatedContainer = styled(Container)<AnimatedComponentProps>`
  transition: 200ms;
  transform: translateX(
    ${(props: AnimatedComponentProps) =>
      props.state === EXITED || props.state === ENTERED ? 0 : 400}px
  );
`;

const ErrorMessage = () => {
  const [animationStart, setAnimationStart] = useState(false);

  const errorMessage = useSelector(selectErrorMessage);

  const dispatch = useDispatch();

  const debouncedHideErrorMessage = useCallback(
    debounce(() => {
      setAnimationStart(false);
      dispatch(hideErrorMessage());
    }, 5000),
    [],
  );

  useEffect(() => {
    setAnimationStart(true);
    debouncedHideErrorMessage();
  }, []);

  const cancelHideErrorMessage = () => {
    debouncedHideErrorMessage.cancel();
  };

  return (
    <Transition in={animationStart} type="ease" timeout={200}>
      {(state) => (
        <AnimatedContainer
          state={state}
          onMouseEnter={cancelHideErrorMessage}
          onMouseLeave={debouncedHideErrorMessage}
        >
          <ErrorIcon />
          <Text>
            <span>{errorMessage}</span>
          </Text>
        </AnimatedContainer>
      )}
    </Transition>
  );
};

export default ErrorMessage;
