import { useDispatch } from 'react-redux';
import useRequest from './useRequest';
import useAuthorizedRequest from './useAuthorizedRequest';
import { setTokenPair, removeTokenPair } from '../redux/auth/actions';

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

    dispatch(setTokenPair(res.data.accessToken, res.data.refreshToken));
    localStorage.setItem('refreshToken', res.data.refreshToken);
  };

  const deauthorize = async () => {
    await authorizedRequest(
      '/logout',
      {
        method: 'POST',
      },
    );

    dispatch(removeTokenPair());
    localStorage.removeItem('refreshToken');
  };

  return {
    authorize, deauthorize,
  };
};

export default useAuthorization;
