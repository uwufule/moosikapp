import { Readable } from 'stream';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import request, { Response, CoreOptions } from 'request';
import FileType from 'file-type';
import HttpErrors from 'http-errors';
import XmlParser from 'fast-xml-parser';

const { JWT_SECRET, CDN_SERVER = '' } = process.env;

const createUploadTargetUri = () => {
  const uid = Crypto.randomBytes(6).toString('hex');
  const target = JWT.sign({ uid }, String(JWT_SECRET), { expiresIn: 1800 });

  return `${CDN_SERVER}/upload-target/${target}`;
};

interface Resolve {
  (value: string): void;
}

interface Reject {
  (error: Error): void;
}

const uploadCallback = (resolve: Resolve, reject: Reject) => (
  (error: Error, response: Response, body: string) => {
    if (error) {
      reject(error);
      return;
    }

    switch (response.statusCode) {
      case 201: {
        resolve(<string>response.headers.location);
        break;
      }
      case 409: {
        reject(new HttpErrors[409]('Resource already exists.'));
        break;
      }
      default:
        reject(new HttpErrors[response.statusCode](XmlParser.parse(body).Error.Details));
    }
  }
);

export default async (contentType: string, buffer: Buffer): Promise<string> => {
  const fileType = await FileType.fromBuffer(buffer);
  if (fileType?.mime !== contentType) {
    throw new HttpErrors.BadRequest(
      'Provided header `Content-Type` and file type does not match.',
    );
  }

  const config: CoreOptions = {
    headers: {
      'content-type': contentType,
    },
  };

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return new Promise((resolve, reject) => {
    stream.pipe(request.put(createUploadTargetUri(), config, uploadCallback(resolve, reject)));
  });
};
