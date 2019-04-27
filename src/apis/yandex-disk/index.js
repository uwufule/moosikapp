import FS from 'fs';
import RequestPromise from 'request-promise';


export default class YandexDriveAPI {
  constructor(oauthToken) {
    this.BASE_URL = 'https://cloud-api.yandex.net/v1/disk';
    this.OAUTH_TOKEN = oauthToken;
  }

  getDiskInfo() {
    return new Promise((resolve, reject) => {
      RequestPromise(this.BASE_URL, { method: 'GET', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then(res => resolve(JSON.parse(res)))
        .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
    });
  }

  createFolder(path) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources?path=${encodeURI(path)}`;
      RequestPromise(uri, { method: 'PUT', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then(res => resolve(JSON.parse(res)))
        .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
    });
  }

  getDirList(path) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources?path=${encodeURI(path)}`;
      RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then(res => resolve(JSON.parse(res)))
        .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
    });
  }

  getFileLink(path) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources/download?path=${encodeURI(path)}`;
      RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then(res => resolve(JSON.parse(res)))
        .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
    });
  }

  uploadFile(remotePath, localPath) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;
      RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then((res) => {
          FS.createReadStream(localPath).pipe(RequestPromise.put(JSON.parse(res).href))
            .on('complete', () => resolve(true))
            .on('error', () => reject(new Error('UploadError')));
        })
        .catch(res => reject(new Error(JSON.parse(res.response.body).error)));
    });
  }

  uploadFileFromStream(remotePath, stream) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;
      RequestPromise(uri, { method: 'GET', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then((res) => {
          stream.pipe(RequestPromise.put(JSON.parse(res).href))
            .on('complete', () => resolve(true))
            .on('error', () => reject(new Error('UploadError')));
        })
        .catch(res => reject(JSON.parse(res.response.body)));
    });
  }

  deleteFile(path) {
    return new Promise((resolve, reject) => {
      const uri = `${this.BASE_URL}/resources?path=${encodeURI(path)}&permanently=true`;
      RequestPromise(uri, { method: 'DELETE', headers: { Authorization: `OAuth ${this.OAUTH_TOKEN}` } })
        .then(() => resolve(true))
        .catch(res => reject(JSON.parse(res.response.body)));
    });
  }
}
