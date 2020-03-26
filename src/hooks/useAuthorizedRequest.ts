import { useSelector, useDispatch } from 'react-redux';
import { AxiosRequestConfig } from 'axios';
import JWT from 'jsonwebtoken';
import useReleaseTokens from './useReleaseTokens';
import authorizedRequest from '../utils/transport/authorizedRequest';
import { setTokenChain } from '../redux/actions/login';
import { RootState } from '../redux/store';

interface AccessTokenRecord {
  uuid: string;
  role: number;
  iat: number;
  exp: number;
}

const useAuthorizedRequest = () => {
  let accessToken = useSelector<RootState, string>(
    (state) => state.login.accessToken,
  );

  const dispatch = useDispatch();

  const releaseTokens = useReleaseTokens();

  return async (url: string, config?: AxiosRequestConfig) => {
    const refreshToken = localStorage.getItem('refreshToken');

    const record = JWT.decode(accessToken) as AccessTokenRecord;
    if (record && (record.exp * 1000 - Date.now() < 60000) && refreshToken) {
      const res = await releaseTokens(refreshToken);

      dispatch(setTokenChain(res.data.token, res.data.refreshToken));
      localStorage.setItem('refreshToken', res.data.refreshToken);

      accessToken = res.data.token;
    }

    return authorizedRequest(url, accessToken, config);
  };
};

export default useAuthorizedRequest;
