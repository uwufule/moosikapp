import { Response } from 'express';
import { Readable } from 'stream';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import request, { CoreOptions } from 'request';
import * as Songs from '../../../api/mongodb/songs';
import { AuthorizedRequest } from '../../../middlewares/authorization';

import messages from './messages.json';

const { CDN_SERVER = '', JWT_SECRET } = process.env;

export default async (req: AuthorizedRequest, res: Response) => {
  const readable = new Readable();
  readable._read = () => {}; // eslint-disable-line no-underscore-dangle

  readable.push(req.body);
  readable.push(null);

  const hex = Crypto.randomBytes(6).toString('hex');
  const target = JWT.sign({ hex }, String(JWT_SECRET), { expiresIn: 1800 });
  const targetUri = `${CDN_SERVER}/upload-target/${target}`;

  const requestOptions: CoreOptions = {
    headers: {
      'content-type': req.headers['content-type'],
    },
  };

  readable.pipe(
    request.put(targetUri, requestOptions, async (uploadError, uploadResult, uploadMsg) => {
      if (uploadError) {
        res.status(500).send({ message: 'Internal server error.' });
        return;
      }

      switch (uploadResult.statusCode) {
        case 201: {
          const uuid = await Songs.saveSong({ uploadedBy: req.jwt.uuid, path: uploadMsg });

          res.status(201).send({ message: messages.UPLOAD_SUCCESSFULLY, uuid });
          break;
        }
        default:
          res.status(400).send({ message: uploadMsg || messages.UPLOAD_ERROR });
      }
    }),
  );
};
