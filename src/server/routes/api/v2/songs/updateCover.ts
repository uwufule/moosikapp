import { Response } from 'express';
import { BadRequest, Forbidden, NotFound } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import { getSongById, updateSong } from '../../../../mongodb/songs';
import upload from '../../../../utils/cdn';

import roles from '../../../../config/roles.json';

const { CDN_SERVER = '' } = process.env;

export default async (req: AuthRequest, res: Response) => {
  if (!Buffer.isBuffer(req.body)) {
    throw new BadRequest('Invalid body provided.');
  }

  const song = await getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  if (song.uploadedBy !== req.auth.uuid && req.auth.role < roles.moderator) {
    throw new Forbidden('Access denied.');
  }

  const path = await upload(req.headers['content-type']!, req.body);
  await updateSong(song.uuid, { cover: `${CDN_SERVER}${path}` });

  res.status(200).send({ message: 'Successfully update song cover.' });
};
