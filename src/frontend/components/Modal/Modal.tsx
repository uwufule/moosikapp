import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 10;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Modal = () => (
  <Wrapper>
    <Container>
      <ErrorMessage />
    </Container>
  </Wrapper>
);

export default Modal;
