import { useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import { setTokens, removeTokens } from '@redux/auth/actions';

const useAuth = () => {
  const { request, authRequest } = useRequest();

  const dispatch = useDispatch();

  const authorize = async (username: string, password: string) => {
    const res = await request('/login', {
      method: 'POST',
      data: {
        username,
        password,
      },
    });

    dispatch(setTokens(res.data.accessToken, res.data.refreshToken));
    localStorage.setItem('token', res.data.refreshToken);
  };

  const deauthorize = async () => {
    await authRequest('/logout', { method: 'POST' });

    dispatch(removeTokens());
    localStorage.removeItem('token');
  };

  return {
    authorize,
    deauthorize,
  };
};

export default useAuth;
