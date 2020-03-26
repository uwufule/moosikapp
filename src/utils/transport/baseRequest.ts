import axios, { AxiosRequestConfig } from 'axios';
import lodash from 'lodash';
import { API_URL } from './config/transport.json';

const baseRequest = (
  url: string,
  config?: AxiosRequestConfig,
) => axios(
  `${API_URL}${url}`,
  {
    ...lodash.merge(config, {
      headers: {
        accept: 'application/json',
      },
    }),
  },
);

export default baseRequest;
