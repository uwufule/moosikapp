/* eslint-disable camelcase */

import FS from 'fs';
import request from 'request-promise';

const BASE_URL = 'https://cloud-api.yandex.net/v1/disk';

let authorization;

export default function (token) {
  authorization = `OAuth ${token}`;
}

export async function getDiskStatus() {
  const res = await request(BASE_URL, {
    method: 'GET',
    headers: { authorization },
  });

  const { total_space, used_space, max_file_size } = JSON.parse(res);

  return {
    totalSpace: total_space, usedSpace: used_space, maxFileSize: max_file_size,
  };
}

export function createDirectory(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}`;

    request(uri, {
      method: 'PUT',
      headers: { authorization },
    })
      .then((res) => {
        resolve(JSON.parse(res).href);
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}

export function getDirList(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}`;

    request(uri, {
      method: 'GET',
      headers: { authorization },
    })
      .then((res) => {
        resolve(JSON.parse(res));
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}

export function getFileLink(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/download?path=${encodeURI(path)}`;

    request(uri, {
      method: 'GET',
      headers: { authorization },
    })
      .then((res) => {
        resolve(JSON.parse(res).href);
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}

export function uploadFile(remotePath, localPath) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;

    request(uri, {
      method: 'GET',
      headers: { authorization },
    })
      .then((res) => {
        FS.createReadStream(localPath).pipe(request.put(JSON.parse(res).href))
          .on('complete', () => {
            resolve(true);
          })
          .on('error', () => {
            reject(new Error('UploadError'));
          });
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}

export function uploadFileFromStream(remotePath, stream) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources/upload/?path=${encodeURI(remotePath)}`;

    request(uri, {
      method: 'GET',
      headers: { authorization },
    })
      .then((res) => {
        stream.pipe(request.put(JSON.parse(res).href))
          .on('complete', () => {
            resolve(true);
          })
          .on('error', () => {
            reject(new Error('UploadError'));
          });
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}

export function deleteFile(path) {
  return new Promise((resolve, reject) => {
    const uri = `${BASE_URL}/resources?path=${encodeURI(path)}&permanently=true`;

    request(uri, {
      method: 'DELETE',
      headers: { authorization },
    })
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        const { error } = JSON.parse(err.response.body);
        reject(new Error(error));
      });
  });
}
