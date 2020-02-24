import { Readable } from 'stream';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import request, { CoreOptions } from 'request';
import FileType from 'file-type';
import HttpErrors from 'http-errors';

const { JWT_SECRET, CDN_SERVER = '' } = process.env;

export default async (contentType: string, buffer: Buffer): Promise<string> => {
  const fileType = await FileType.fromBuffer(buffer);

  if (fileType?.mime !== contentType) {
    throw new HttpErrors.BadRequest('Provided header `Content-Type` and file type does not match.');
  }

  const uploadTarget = JWT.sign({
    hex: Crypto.randomBytes(6).toString('hex'),
  }, String(JWT_SECRET), { expiresIn: 1800 });
  const targetUri = `${CDN_SERVER}/upload-target/${uploadTarget}`;

  const requestOptions: CoreOptions = {
    headers: {
      'content-type': contentType,
    },
  };

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

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
            reject(new HttpErrors[uploadResult.statusCode](uploadMsg));
        }
      }),
    );
  });
};
