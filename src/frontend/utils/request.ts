import axios, { AxiosRequestConfig } from 'axios';
import merge from 'lodash/merge';

const API_URL = '/api/v2';

const request = (url: string, config: AxiosRequestConfig) => (
  axios(`${API_URL}${url}`, merge(config, {
    headers: {
      accept: 'application/json',
    },
  }))
);

export default request;
