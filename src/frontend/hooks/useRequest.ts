import { AxiosRequestConfig } from 'axios';
import baseRequest from '../utils/transport/baseRequest';

const useRequest = () => (
  async (url: string, config?: AxiosRequestConfig) => (
    baseRequest(url, config)
  )
);

export default useRequest;
