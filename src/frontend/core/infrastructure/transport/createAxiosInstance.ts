import NetworkError from '@core/errors/NetworkError';
import axios, { AxiosError } from 'axios';
import Authorization from './interfaces/Authorization';
import getAuthString from './utils/getAuthString';

const API_BASE_URL = '/api/v3';

const createAxiosInstance = (authorization?: Authorization) => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      accept: 'application/json',
      authorization: getAuthString(authorization),
    },
  });

  axiosInstance.interceptors.response.use(undefined, (error: AxiosError<{ message: string }>) => {
    if (error.response && (error.response.status < 200 || error.response.status >= 300)) {
      throw new NetworkError(error.response.data.message || error.response.statusText);
    }
  });

  return axiosInstance;
};

export default createAxiosInstance;
