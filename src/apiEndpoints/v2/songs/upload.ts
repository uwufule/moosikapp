import { Readable } from 'stream';
import { Response } from 'express';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as Songs from '../../../mongodb/songs';
import upload from '../../../utils/cdn';

import messages from './messages.json';

export default async (req: AuthorizedRequest, res: Response) => {
  const readable = new Readable();

  if (!(req.body instanceof Buffer)) {
    throw new HttpErrors.BadRequest(messages.UPLOAD_ERROR);
  }

  readable.push(req.body);
  readable.push(null);

  const path = await upload('audio/mpeg', readable);
  const uuid = await Songs.saveSong({ uploadedBy: req.jwt.uuid, path });

  res.status(201).send({ message: messages.UPLOAD_SUCCESSFULLY, uuid });
};
