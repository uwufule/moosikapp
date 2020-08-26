import { Response } from 'express';
import { BadRequest } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import * as Songs from '../../../../database/mongo/songs';
import upload from '../../../../utils/cdn';

export default async (req: AuthRequest, res: Response) => {
  if (!Buffer.isBuffer(req.body)) {
    throw new BadRequest('Invalid body provided.');
  }

  const path = await upload(req.body, 'audio/mpeg');
  const uuid = await Songs.saveSong({ uploadedBy: req.auth.userId, path });

  res.status(201).send({
    message: 'Successfully upload song.',
    uuid,
  });
};
