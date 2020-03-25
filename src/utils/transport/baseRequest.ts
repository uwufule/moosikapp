import axios, { Method } from 'axios';
import { API_URL } from './config/transport.json';

export interface Headers {
  [header: string]: string;
}

export interface BaseRequestConfig {
  method?: Method;
  headers?: Headers;
  data?: any;
}

const baseRequest = (url: string, { method, headers, data }: BaseRequestConfig) => axios(
  `${API_URL}${url}`,
  {
    method,
    headers: {
      accept: 'application/json',
      ...headers,
    },
    data,
  },
);

export default baseRequest;
