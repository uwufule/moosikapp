import { useSelector } from 'react-redux';
import { AxiosRequestConfig } from 'axios';
import useTokenManager from './useTokenManager';
import authorizedRequest from '../utils/transport/authorizedRequest';
import { RootState } from '../redux/store';

const useAuthorizedRequest = () => {
  let accessToken = useSelector<RootState, string>(
    (state) => state.login.accessToken,
  );

  const tokenManager = useTokenManager();

  return async (url: string, config?: AxiosRequestConfig) => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      const tokens = await tokenManager.releaseTokens(accessToken, refreshToken);
      if (tokens) {
        accessToken = tokens.accessToken;
      }
    }

    return authorizedRequest(url, accessToken, config);
  };
};

export default useAuthorizedRequest;
