import axios, { AxiosRequestConfig } from 'axios';
import _merge from 'lodash/merge';

const API_URL = '/api/v2';

export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

const request = (url: string, config: AxiosRequestConfig) =>
  axios(
    `${API_URL}${url}`,
    _merge(config, {
      headers: {
        accept: 'application/json',
      },
    }),
  );

export default request;
