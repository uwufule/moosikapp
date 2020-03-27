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

    if (accessToken && refreshToken && tokenManager.checkIsAccessTokenExpired(accessToken)) {
      const tokenPair = await tokenManager.releaseTokenPair(refreshToken);

      accessToken = tokenPair.accessToken;
    }

    return authorizedRequest(url, accessToken, config);
  };
};

export default useAuthorizedRequest;
