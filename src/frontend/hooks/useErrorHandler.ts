import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { showErrorMessage } from '@redux/modal/actions';

const useErrorHandler = <C extends Function, F extends Function>(catchFn?: C, finallyFn?: F) => {
  const dispatch = useDispatch();

  return async (fn: Function) => {
    try {
      await fn();
    } catch (err) {
      if (typeof catchFn === 'function') {
        catchFn();
      }

      if (err.isAxiosError) {
        const axiosErr = <AxiosError>err;
        dispatch(showErrorMessage(axiosErr.response?.data.message || 'Unknown error.'));

        return;
      }

      dispatch(showErrorMessage(err.message));
    } finally {
      if (typeof finallyFn === 'function') {
        finallyFn();
      }
    }
  };
};

export default useErrorHandler;
