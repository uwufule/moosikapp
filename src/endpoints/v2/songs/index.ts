import { Response } from 'express';
import Joi from '@hapi/joi';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import * as Songs from '../../../api/mongodb/songs';
import * as Users from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

import scopes from '../../../config/scopes.json';
import roles from '../../../config/roles.json';

import messages from './messages.json';

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
  return async (req: AuthorizedRequest, res: Response) => {
    const validationSchema = Joi.object({
      skip: Joi.number()
        .min(0)
        .error(new Error(messages.INVALID_QUERY_PARAMETER.SKIP)),
      limit: Joi.number()
        .min(1)
        .max(100)
        .error(new Error(messages.INVALID_QUERY_PARAMETER.LIMIT)),
      scope: Joi.number()
        .error(new Error(messages.INVALID_QUERY_PARAMETER.SCOPE)),
    });

    try {
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      const songList = await Songs.getSongs(value.skip, value.limit);
      if (songList.length === 0) {
        throw new APIError(404, messages.songs.NOT_FOUND);
      }

      const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = songData;

        if (value.scope & scopes.favorite) {
          song.favorite = likes.includes(req.jwt.uuid);
        }

        if (value.scope & scopes.edit) {
          song.edit = (uploadedBy === req.jwt.uuid) || (req.jwt.role >= roles.moderator);
        }

        return song;
      });

      res.status(200).send({ message: messages.songs.SUCCESS, songs });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function getByUuid() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const song = await Songs.getByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, messages.song.NOT_FOUND);
      }

      const {
        path, uploadedBy, likes, ...songData
      } = song;

      const user = await Users.getByUuid(uploadedBy);

      res.status(200).send({
        message: messages.song.SUCCESS,
        song: {
          ...songData,
          url: `${CDN_SERVER}${path}`,
          uploadedBy: user?.username || 'deactivated user',
          favorite: likes.includes(req.jwt.uuid),
          edit: uploadedBy === req.jwt.uuid,
        },
      });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function findSongs() {
  const validationSchema = Joi.object({
    skip: Joi.number()
      .min(0)
      .error(new Error(messages.INVALID_QUERY_PARAMETER.SKIP)),
    limit: Joi.number()
      .min(1)
      .max(100)
      .error(new Error(messages.INVALID_QUERY_PARAMETER.LIMIT)),
    scope: Joi.number()
      .error(new Error(messages.INVALID_QUERY_PARAMETER.SCOPE)),
    query: Joi.string()
      .required()
      .error(new Error(messages.INVALID_QUERY_PARAMETER.QUERY)),
  });

  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      const songList = await Songs.findSongs(decodeURI(value.query), value.skip, value.limit);
      if (songList.length === 0) {
        throw new APIError(404, messages.songs.NOT_FOUND);
      }

      const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = songData;

        if (value.scope & scopes.favorite) {
          song.favorite = likes.includes(req.jwt.uuid);
        }

        if (value.scope & scopes.edit) {
          song.edit = (uploadedBy === req.jwt.uuid) || (req.jwt.role >= roles.moderator);
        }

        return song;
      });

      res.status(200).send({ message: messages.songs.SUCCESS, songs });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function uploadSong() {
  return upload;
}

export function updateSong() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const song = await Songs.getByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, messages.song.NOT_FOUND);
      }

      if ((song.uploadedBy !== req.jwt.uuid) && (req.jwt.role < roles.moderator)) {
        throw new APIError(403, messages.ACCESS_DENY);
      }

      const validationSchema = Joi.object({
        author: Joi.string()
          .min(1)
          .error(new Error(messages.INVALID_BODY_PARAMETER.AUTHOR)),
        title: Joi.string()
          .min(1)
          .error(new Error(messages.INVALID_BODY_PARAMETER.TITLE)),
        cover: Joi.string()
          .error(new Error(messages.INVALID_BODY_PARAMETER.COVER)),
      });

      const { error, value: songData } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      await Songs.updateSong(req.params.songId, songData);

      res.status(200).send({ message: messages.UPDATE_SUCCESSFULLY, song: songData });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function deleteSong() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const song = await Songs.getByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, messages.song.NOT_FOUND);
      }

      if ((song.uploadedBy !== req.jwt.uuid) && (req.jwt.role < roles.moderator)) {
        throw new APIError(403, messages.ACCESS_DENY);
      }

      await Songs.deleteSong(req.params.songId);

      res.status(204).send();
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
