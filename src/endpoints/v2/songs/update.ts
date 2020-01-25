import { Response, Request } from 'express';
import { Readable } from 'stream';
import Joi from '@hapi/joi';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import { getByUuid, updateSong } from '../../../api/mongodb/songs';
import upload from '../../../api/cdn/upload';
import APIError from '../../../errors/APIError';

import roles from '../../../config/roles.json';

import messages from './messages.json';

interface ISongUpdatedFields {
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

async function fromJson(req: Request): Promise<ISongUpdatedFields> {
  const validationSchema = generalValidationSchema.keys({
    cover: Joi.string()
      .uri()
      .error(new Error(messages.INVALID_BODY_PARAMETER.COVER)),
  });

  const { error, value: songData } = validationSchema.validate(req.body);
  if (error) {
    throw new APIError(400, error.message);
  }

  await updateSong(req.params.songId, songData);

  return songData;
}

async function fromFormData(req: Request): Promise<ISongUpdatedFields> {
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
    throw new APIError(400, error.message);
  }

  const readable = new Readable();

  readable.push(req.file.buffer);
  readable.push(null);

  const path = await upload(req.file.mimetype, readable);

  return { ...songData, cover: `${CDN_SERVER}${path}` };
}

export default async (req: AuthorizedRequest, res: Response) => {
  try {
    const song = await getByUuid(req.params.songId);
    if (!song) {
      throw new APIError(404, messages.song.NOT_FOUND);
    }

    if ((song.uploadedBy !== req.jwt.uuid) && (req.jwt.role < roles.moderator)) {
      throw new APIError(403, messages.ACCESS_DENY);
    }

    let message;
    if (req.headers['content-type'] === 'application/json') {
      message = await fromJson(req);
    } else {
      message = await fromFormData(req);
    }

    res.status(200).send({ message });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
