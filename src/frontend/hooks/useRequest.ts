import { AxiosRequestConfig } from 'axios';
import baseRequest from '../utils/transport/baseRequest';

const useRequest = () => (url: string, config?: AxiosRequestConfig) => baseRequest(url, config);

export default useRequest;
