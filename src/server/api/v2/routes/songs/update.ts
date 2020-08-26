import { Response } from 'express';
import Joi from 'joi';
import { BadRequest, Forbidden, NotFound } from 'http-errors';
import { AuthRequest } from '../../middlewares/authorization';
import { getSongById, updateSong } from '../../../../database/mongo/songs';

import roles from '../../../../config/roles.json';

const bodyScheme = Joi.object({
  author: Joi.string().min(1).max(120).error(new Error('Invalid field `author` provided.')),
  title: Joi.string().min(1).max(120).error(new Error('Invalid field `title` provided.')),
  cover: Joi.string().uri().error(new Error('Invalid field `cover` provided.')),
});

export default async (req: AuthRequest, res: Response) => {
  const song = await getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  if (song.uploadedBy !== req.auth.userId && req.auth.userRole < roles.moderator) {
    throw new Forbidden('Access denied.');
  }

  const { error, value } = bodyScheme.validate(req.body);
  if (error) {
    throw new BadRequest(error.message);
  }

  await updateSong(song.uuid, value);

  res.status(200).send({ message: 'Successfully update song.', song: value });
};
