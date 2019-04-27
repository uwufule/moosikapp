import FS from 'fs';
import RequestPromise from 'request-promise';


const BASE_URL = 'https://cloud-api.yandex.net/v1/disk';

let OAUTH_TOKEN = '';


export default function (token) {
  OAUTH_TOKEN = token;
}

export function getDiskInfo() {
  return new Promise((resolve, reject) => {
    RequestPromise(BASE_URL, { method: 'GET', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then((res) => {
        /* eslint-disable camelcase */
        const { total_space, used_space, max_file_size } = JSON.parse(res);
        resolve({
          totalSpace: total_space,
          usedSpace: used_space,
          maxFileSize: max_file_size,
        });
        /* eslint-enable camelcase */
      })
      .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
  });
}

export function createFolder(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}`;
    RequestPromise(uri, { method: 'PUT', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then(res => resolve(JSON.parse(res).href))
      .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
  });
}

export function getDirList(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}`;
    RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then(res => resolve(JSON.parse(res)))
      .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
  });
}

export function getFileLink(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/download?path=${encodeURI(path)}`;
    RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then(res => resolve(JSON.parse(res).href))
      .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
  });
}

export function uploadFile(remotePath, localPath) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;
    RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then((res) => {
        FS.createReadStream(localPath).pipe(RequestPromise.put(JSON.parse(res).href))
          .on('complete', () => resolve(true))
          .on('error', () => reject(new Error('UploadError')));
      })
      .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
  });
}

export function uploadFileFromStream(remotePath, stream) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;
    RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then((res) => {
        stream.pipe(RequestPromise.put(JSON.parse(res).href))
          .on('complete', () => resolve(true))
          .on('error', () => reject(new Error('UploadError')));
      })
      .catch(res => reject(JSON.parse(res.response.body)));
  });
}

export function deleteFile(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}&permanently=true`;
    RequestPromise(uri, { method: 'DELETE', headers: { Authorization: `OAuth ${OAUTH_TOKEN}` } })
      .then(() => resolve(true))
      .catch(res => reject(JSON.parse(res.response.body)));
  });
}
