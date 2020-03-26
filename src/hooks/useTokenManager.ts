import { useDispatch } from 'react-redux';
import JWT from 'jsonwebtoken';
import useRequest from './useRequest';
import { setTokenChain } from '../redux/actions/login';
import { RootState } from '../redux/store';

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

  const releaseTokens = async (
    accessToken: string,
    refreshToken: string,
  ): Promise<TokenPair | null> => {
    const record = <AccessTokenRecord>JWT.decode(accessToken);
    if (record && (record.exp * 1000 - Date.now() < 60000)) {
      const res = await request(
        '/login/refresh',
        {
          method: 'GET',
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
    }

    return null;
  };

  return {
    releaseTokens,
  };
};

export default useTokenManeger;
