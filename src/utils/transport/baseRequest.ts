import axios, { Method } from 'axios';
import { API_URL } from './config/transport.json';

export interface Headers {
  [header: string]: string;
}

export interface BaseRequestConfig {
  method?: Method;
  headers?: Headers;
  data?: any;
  onUploadProgress?: (progress: number) => void;
}

const baseRequest = (
  url: string, {
    method, headers, data, onUploadProgress,
  }: BaseRequestConfig,
) => axios(
  `${API_URL}${url}`,
  {
    method,
    headers: {
      accept: 'application/json',
      ...headers,
    },
    data,
    onUploadProgress: (progress) => {
      if (onUploadProgress && progress) {
        onUploadProgress(progress.loaded / progress.total);
      }
    },
  },
);

export default baseRequest;
