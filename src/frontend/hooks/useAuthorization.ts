import { useDispatch } from 'react-redux';
import useRequest from './useRequest';
import useAuthorizedRequest from './useAuthorizedRequest';
import { setTokenChain, clearTokenChain } from '../redux/actions/login';

const useAuthorization = () => {
  const request = useRequest();
  const authorizedRequest = useAuthorizedRequest();

  const dispatch = useDispatch();

  const authorize = async (username: string, password: string) => {
    const res = await request(
      '/login',
      {
        method: 'POST',
        data: {
          username, password,
        },
      },
    );

    dispatch(setTokenChain(res.data.token, res.data.refreshToken));
    localStorage.setItem('refreshToken', res.data.refreshToken);
  };

  const deauthorize = async () => {
    await authorizedRequest(
      '/logout',
      {
        method: 'POST',
      },
    );

    dispatch(clearTokenChain());
    localStorage.removeItem('refreshToken');
  };

  return {
    authorize, deauthorize,
  };
};

export default useAuthorization;
