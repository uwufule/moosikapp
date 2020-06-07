import { useSelector } from 'react-redux';
import { AxiosRequestConfig } from 'axios';
import merge from 'lodash/merge';
import useTokenManager from '@hooks/useTokenManager';
import { RootState } from '@redux/store';
import baseRequest from '@utils/request';

const useRequest = () => {
  const accessToken = useSelector<RootState, string>(
    (state) => state.auth.accessToken,
  );

  const { refresh, isAccessTokenExpiresSoon } = useTokenManager();

  const request = (url: string, config?: AxiosRequestConfig) => (
    baseRequest(url, merge(config, {
      headers: {
        accept: 'application/json',
      },
    }))
  );

  const authRequest = async (url: string, config?: AxiosRequestConfig) => {
    if (isAccessTokenExpiresSoon()) {
      await refresh();
    }

    return baseRequest(url, merge(config, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    }));
  };

  return {
    request,
    authRequest,
  };
};

export default useRequest;
