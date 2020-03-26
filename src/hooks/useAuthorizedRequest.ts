import { AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import authorizedRequest from '../utils/transport/authorizedRequest';

const useAuthorizedRequest = () => {
  const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);

  return async (url: string, config?: AxiosRequestConfig) => (
    authorizedRequest(url, accessToken, config)
  );
};

export default useAuthorizedRequest;
