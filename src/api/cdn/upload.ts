import { Readable } from 'stream';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import request, { CoreOptions } from 'request';

const { JWT_SECRET, CDN_SERVER = '' } = process.env;

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export default async (contentType: string, stream: Readable): Promise<string> => {
  const hex = Crypto.randomBytes(6).toString('hex');
  const target = JWT.sign({ hex }, String(JWT_SECRET), { expiresIn: 1800 });
  const targetUri = `${CDN_SERVER}/upload-target/${target}`;

  const requestOptions: CoreOptions = {
    headers: {
      'content-type': contentType,
    },
  };

  return new Promise((resolve, reject) => {
    stream.pipe(
      request.put(targetUri, requestOptions, async (uploadError, uploadResult, uploadMsg) => {
        if (uploadError) {
          reject(uploadError);
          return;
        }

        switch (uploadResult.statusCode) {
          case 201: {
            resolve(uploadMsg);
            break;
          }
          default:
            reject(new UploadError(uploadMsg));
        }
      }),
    );
  });
};
