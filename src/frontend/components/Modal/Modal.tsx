import { hideErrorMessage } from '@redux/modal/actions';
import { selectErrorMessage } from '@redux/modal/selectors';
import { useDispatch, useSelector } from 'react-redux';
import Transition, { ENTERED, EXITED, TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import MessageBox from './MessageBox';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 10;
`;

interface AnimatedComponentProps {
  state: TransitionStatus;
}

const AnimatedModalWrapper = styled(Wrapper)<AnimatedComponentProps>`
  transition: opacity 200ms ease;
  opacity: ${(props: AnimatedComponentProps) =>
    props.state === EXITED || props.state === ENTERED ? 1 : 0};
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Modal = () => {
  const errorMessage = useSelector(selectErrorMessage);

  const dispatch = useDispatch();

  const onHide = () => {
    dispatch(hideErrorMessage());
  };

  return (
    <Transition in={errorMessage !== ''} mountOnEnter unmountOnExit type="ease" timeout={200}>
      {(state) => (
        <AnimatedModalWrapper state={state}>
          <Container>
            <MessageBox text={errorMessage} type="error" onHide={onHide} />
          </Container>
        </AnimatedModalWrapper>
      )}
    </Transition>
  );
};

export default Modal;
