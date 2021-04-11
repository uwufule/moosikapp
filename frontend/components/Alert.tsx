import debounce from 'lodash/debounce';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition, TransitionStatus } from 'react-transition-group';
import styled from 'styled-components';
import { hideAlert } from '../redux/alert/actions';
import { selectAlert } from '../redux/alert/selectors';

interface AlertContainerProps {
  status: TransitionStatus;
}

const AlertContainer = styled.div<AlertContainerProps>`
  width: 100%;
  height: 100%;
  height: -webkit-fill-available;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: ${(props) => (props.status === 'entered' ? 1 : 0)};
  transition: opacity 200ms ease;
`;

type AlertProps = AlertContainerProps & { isError: boolean };

const AlertBox = styled.div<AlertProps>`
  min-width: 200px;
  position: absolute;
  right: 20px;
  top: 20px;
  margin-left: 20px;
  padding: 1rem 2rem;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  background: ${(props) => (props.isError ? '#f1415f' : '#50bf77')};
  transform: translateX(${(props) => (props.status === 'entering' ? '100%' : '0')});
  pointer-events: auto;
  transition: 200ms ease all;

  @media (max-width: 300px) {
    min-width: unset;
  }
`;

const AlertComponent: React.FC<PropsWithChildren<AlertProps>> = ({ children, status, isError }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(hideAlert());
    };
  }, []);

  return (
    <AlertBox status={status} isError={isError}>
      {children}
    </AlertBox>
  );
};

const Alert: React.FC = () => {
  const [flag, setFlag] = useState(false);

  const hideAlert = useCallback(
    debounce(() => setFlag(false), 5000),
    [],
  );

  const alert = useSelector(selectAlert);

  useEffect(() => {
    hideAlert.cancel();
    setFlag(typeof alert !== 'undefined');
    hideAlert();
  }, [alert]);

  return (
    <Transition in={flag} mountOnEnter unmountOnExit type="ease" timeout={200}>
      {(status) => (
        <AlertContainer status={status}>
          <AlertComponent status={status} isError={alert?.type === 'error'}>
            {alert?.message}
          </AlertComponent>
        </AlertContainer>
      )}
    </Transition>
  );
};

export default Alert;
