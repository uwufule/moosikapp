import { useDispatch } from 'react-redux';
import JWT from 'jsonwebtoken';
import useRequest from './useRequest';
import { setTokenChain } from '../redux/actions/login';

interface AccessTokenRecord {
  uuid: string;
  role: number;
  iat: number;
  exp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const useTokenManeger = () => {
  const dispatch = useDispatch();

  const request = useRequest();

  const isAccessTokenExpired = (accessToken: string): boolean => {
    const record = <AccessTokenRecord>JWT.decode(accessToken);
    if (!record) {
      throw new Error('Unable to decode access token.');
    }

    return record.exp * 1000 - Date.now() < 60000;
  };

  const releaseTokenPair = async (refreshToken: string): Promise<TokenPair> => {
    const res = await request(
      '/login/refresh',
      {
        method: 'POST',
        params: {
          refreshToken,
        },
      },
    );

    dispatch(setTokenChain(res.data.token, res.data.refreshToken));
    localStorage.setItem('refreshToken', res.data.refreshToken);

    return {
      accessToken: res.data.token,
      refreshToken: res.data.refreshToken,
    };
  };

  return {
    isAccessTokenExpired,
    releaseTokenPair,
  };
};

export default useTokenManeger;
