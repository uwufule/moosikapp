import axios from 'axios';

export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

const request = axios.create({ baseURL: '/api/v3', headers: { accept: 'application/json' } });

export default request;
