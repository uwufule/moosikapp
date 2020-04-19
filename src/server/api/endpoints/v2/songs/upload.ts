import { Response } from 'express';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../../middlewares/authorization';
import * as Songs from '../../../../mongodb/songs';
import upload from '../../../../utils/cdn';

import messages from './messages.json';

export default async (req: AuthorizedRequest, res: Response) => {
  if (!Buffer.isBuffer(req.body)) {
    throw new HttpErrors.BadRequest(messages.UPLOAD_ERROR);
  }

  const path = await upload('audio/mpeg', req.body);
  const uuid = await Songs.saveSong({ uploadedBy: req.jwt.uuid, path });

  res.status(201).send({ message: messages.UPLOAD_SUCCESS, uuid });
};
