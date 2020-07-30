import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { hideErrorMessage } from '@redux/modal/actions';
import { RootState } from '@redux/store';
import { Theme } from '@components/ThemeProvider';
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
  white-space: nowrap;
  flex: 1;
`;

const ErrorMessage = () => {
  const message = useSelector<RootState, string>((state) => state.modal.errorMessage);

  const dispatch = useDispatch();

  const debouncedHideErrorMessage = debounce(() => {
    dispatch(hideErrorMessage());
  }, 5000);

  useEffect(() => {
    debouncedHideErrorMessage();
  }, []);

  return (
    <Container
      onMouseEnter={() => {
        debouncedHideErrorMessage.cancel();
      }}
      onMouseLeave={() => {
        debouncedHideErrorMessage();
      }}
    >
      <ErrorIcon />
      <Text>
        <span>{message}</span>
      </Text>
    </Container>
  );
};

export default ErrorMessage;
