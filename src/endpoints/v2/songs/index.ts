import { Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import * as Songs from '../../../api/mongodb/songs';
import * as Users from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

import scopes from '../../../config/scopes.json';
import roles from '../../../config/roles.json';

const { CDN_SERVER = '' } = process.env;

interface SongData {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export function getSongs() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const validationSchema = Joi.object({
      skip: Joi.number()
        .min(0)
        .error(new Error('Invalid query parameter `skip` provided.')),
      limit: Joi.number()
        .min(1)
        .max(100)
        .error(new Error('Invalid query parameter `limit` provided.')),
      scope: Joi.number()
        .error(new Error('Invalid query parameter `scope` provided.')),
    });

    try {
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      const { skip, limit, scope } = value;

      const songList = await Songs.getSongs(skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
      }

      const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = songData;

        if (scope & scopes.favorite) {
          song.favorite = likes.includes(req.jwt.uuid);
        }

        if (scope & scopes.edit) {
          song.edit = (uploadedBy === req.jwt.uuid) || (req.jwt.role >= roles.moderator);
        }

        return song;
      });

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      next(e);
    }
  };
}

export function getByUuid() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const song = await Songs.getByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      const {
        path, uploadedBy, likes, ...songData
      } = song;

      const user = await Users.getByUuid(uploadedBy);

      res.status(200).send({
        message: 'Successfully retrieved song.',
        song: {
          ...songData,
          url: `${CDN_SERVER}${path}`,
          uploadedBy: user ? user.username : 'deactivated user',
          favorite: likes.includes(req.jwt.uuid),
          edit: uploadedBy === req.jwt.uuid,
        },
      });
    } catch (e) {
      next(e);
    }
  };
}

export function findSongs() {
  const validationSchema = Joi.object({
    skip: Joi.number()
      .min(0)
      .error(new Error('Invalid query parameter `skip` provided.')),
    limit: Joi.number()
      .min(1)
      .max(100)
      .error(new Error('Invalid query parameter `limit` provided.')),
    scope: Joi.number()
      .error(new Error('Invalid query parameter `scope` provided.')),
    query: Joi.string()
      .required()
      .error(new Error('Invalid query parameter `query` provided.')),
  });

  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      const {
        skip, limit, scope, query,
      } = value;

      const songList = await Songs.findSongs(decodeURI(query), skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
      }

      const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = { ...songData };

        if (scope & scopes.favorite) {
          song.favorite = likes.includes(req.jwt.uuid);
        }

        if (scope & scopes.edit) {
          song.edit = uploadedBy === req.jwt.uuid || req.jwt.role >= roles.moderator;
        }

        return song;
      });

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      next(e);
    }
  };
}

export function uploadSong() {
  return (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    if (!req.body || Number(req.headers['content-length']) === 0) {
      next(new APIError(400, 'No body provided.'));
      return;
    }

    upload(req, res, next);
  };
}

export function updateSong() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const {
      body,
      params: {
        songId,
      },
      jwt: {
        uuid, role,
      },
    } = req;

    try {
      if (!body) {
        throw new APIError(400, 'No body provided.');
      }

      const song = await Songs.getByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      if (song.uploadedBy !== uuid && role < roles.moderator) {
        throw new APIError(403, 'Forbitten.');
      }

      const validationSchema = Joi.object({
        author: Joi.string()
          .min(1)
          .error(new Error('Invalid parameter `author` provided.')),
        title: Joi.string()
          .min(1)
          .error(new Error('Invalid parameter `title` provided.')),
        cover: Joi.string()
          .error(new Error('Invalid parameter `cover` provided.')),
      });

      const { error, value: songData } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      await Songs.updateSong(songId, songData);

      res.status(200).send({ message: 'Successfully updated song.', song: songData });
    } catch (e) {
      next(e);
    }
  };
}

export function deleteSong() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const {
      params: {
        songId,
      },
      jwt: {
        uuid, role,
      },
    } = req;

    try {
      const song = await Songs.getByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      if (song.uploadedBy !== uuid && role < roles.moderator) {
        throw new APIError(403, 'Forbitten.');
      }

      await Songs.deleteSong(songId);

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
