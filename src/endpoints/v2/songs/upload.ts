import { Response } from 'express';
import { Readable } from 'stream';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as Songs from '../../../api/mongodb/songs';
import upload, { UploadError } from '../../../api/cdn/upload';
import APIError from '../../../errors/APIError';

import messages from './messages.json';

export default async (req: AuthorizedRequest, res: Response) => {
  const readable = new Readable();

  readable.push(req.body);
  readable.push(null);

  try {
    const { 'content-type': contentType } = req.headers;
    if (!contentType || contentType !== 'audio/mpeg') {
      throw new APIError(415, messages.UNSUPPORTED_MEDIA_TYPE);
    }

    const path = await upload(contentType, readable);
    const uuid = await Songs.saveSong({ uploadedBy: req.jwt.uuid, path });

    res.status(201).send({ message: messages.UPLOAD_SUCCESSFULLY, uuid });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    if (e instanceof UploadError) {
      res.status(409).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
