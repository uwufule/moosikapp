import { Response } from 'express';
import { BadRequest, Forbidden, NotFound, UnsupportedMediaType } from 'http-errors';
import { AuthRequest } from '../../middlewares/authorization';
import { getSongById, updateSong } from '../../../../database/mongo/songs';
import upload from '../../../../utils/cdn';

import roles from '../../../../config/roles.json';

const { CDN_SERVER = '' } = process.env;

export default async (req: AuthRequest, res: Response) => {
  const { 'content-type': contentType } = req.headers;
  if (!contentType || !/image\/(png|jpe?g|webp)/.test(contentType)) {
    throw new UnsupportedMediaType('Unsupported image format.');
  }

  if (!Buffer.isBuffer(req.body)) {
    throw new BadRequest('Invalid body provided.');
  }

  const song = await getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  if (song.uploadedBy !== req.auth.userId && req.auth.userRole < roles.moderator) {
    throw new Forbidden('Access denied.');
  }

  const path = await upload(req.body, contentType);
  await updateSong(song.uuid, { cover: `${CDN_SERVER}${path}` });

  res.status(200).send({ message: 'Successfully update song cover.' });
};
