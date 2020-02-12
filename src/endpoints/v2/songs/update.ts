import { Readable } from 'stream';
import { Response, Request } from 'express';
import Joi from '@hapi/joi';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import { getSongByUuid, updateSong } from '../../../api/mongodb/songs';
import upload from '../../../api/cdn/upload';

import roles from '../../../config/roles.json';

import messages from './messages.json';

interface IUpdatedFields {
  author?: string;
  title?: string;
  cover?: string;
}

const { CDN_SERVER = '' } = process.env;

const generalValidationSchema = Joi.object({
  author: Joi.string()
    .min(1)
    .max(120)
    .error(new Error(messages.INVALID_BODY_PARAMETER.AUTHOR)),
  title: Joi.string()
    .min(1)
    .max(120)
    .error(new Error(messages.INVALID_BODY_PARAMETER.TITLE)),
  cover: Joi.any(),
});

const fromJson = async (req: Request): Promise<IUpdatedFields> => {
  const validationSchema = generalValidationSchema.keys({
    cover: Joi.string()
      .uri()
      .error(new Error(messages.INVALID_BODY_PARAMETER.COVER)),
  });

  const { error, value: songData } = validationSchema.validate(req.body);
  if (error) {
    throw new HttpErrors.BadRequest(error.message);
  }

  await updateSong(req.params.songId, songData);

  return songData;
};

const fromFormData = async (req: Request): Promise<IUpdatedFields> => {
  const validationSchema = generalValidationSchema.keys({
    cover: Joi.object({
      type: Joi.string()
        .required()
        .regex(/image\/(jpe?g|png|webp)/),
      size: Joi.number()
        .required()
        .max(2097152),
    })
      .error(new Error(messages.INVALID_BODY_PARAMETER.COVER)),
  });

  const { error, value: songData } = validationSchema.validate({
    ...req.body,
    cover: {
      type: req.file.mimetype,
      size: req.file.size,
    },
  });
  if (error) {
    throw new HttpErrors.BadRequest(error.message);
  }

  const readable = new Readable();

  readable.push(req.file.buffer);
  readable.push(null);

  const path = await upload(req.file.mimetype, readable);

  return { ...songData, cover: `${CDN_SERVER}${path}` };
};

export default async (req: AuthorizedRequest, res: Response) => {
  const song = await getSongByUuid(req.params.songId);
  if (!song) {
    throw new HttpErrors.NotFound(messages.song.NOT_FOUND);
  }

  if ((song.uploadedBy !== req.jwt.uuid) && (req.jwt.role < roles.moderator)) {
    throw new HttpErrors.Forbidden(messages.ACCESS_DENY);
  }

  let message;
  if (req.headers['content-type'] === 'application/json') {
    message = await fromJson(req);
  } else {
    message = await fromFormData(req);
  }

  res.status(200).send({ message });
};
