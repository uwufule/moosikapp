import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import FileType from 'file-type';
import HttpErrors from 'http-errors';
import fetch, { FetchError } from 'node-fetch';

const { JWT_SECRET, CDN_SERVER = '' } = process.env;

const createUploadTargetUri = () => {
  const uid = Crypto.randomBytes(6).toString('hex');
  const target = JWT.sign({ uid }, String(JWT_SECRET), { expiresIn: 1800 });

  return `${CDN_SERVER}/upload-target/${target}`;
};

export default async (buffer: Buffer, contentType: string): Promise<string> => {
  const fileType = await FileType.fromBuffer(buffer);
  if (fileType?.mime !== contentType) {
    throw new HttpErrors.BadRequest('Header `Content-Type` and file type does not match.');
  }

  try {
    const res = await fetch(createUploadTargetUri(), {
      method: 'PUT',
      headers: {
        'content-type': contentType,
      },
      body: buffer,
    });

    return <string>res.headers.get('location');
  } catch (e) {
    if (e instanceof FetchError) {
      // throw error, recieved from cdn server
    }

    throw new HttpErrors.ServiceUnavailable('CDN server is unavailable.');
  }
};
