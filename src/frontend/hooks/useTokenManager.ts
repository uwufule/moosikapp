import { useDispatch } from 'react-redux';
import JWT from 'jsonwebtoken';
import useRequest from './useRequest';
import { setTokenPair } from '../redux/auth/actions';

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

  const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
    const res = await request(
      '/login/refresh',
      {
        method: 'POST',
        params: {
          refreshToken,
        },
      },
    );

    dispatch(setTokenPair(res.data.accessToken, res.data.refreshToken));
    localStorage.setItem('refreshToken', res.data.refreshToken);

    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };
  };

  return {
    isAccessTokenExpired,
    refreshTokens,
  };
};

export default useTokenManeger;
