import { Response, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import update from './update';
import * as Songs from '../../../api/mongodb/songs';
import * as Users from '../../../api/mongodb/users';

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

export const getSongs = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
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

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const songList = await Songs.getSongs(value.skip, value.limit);
    if (songList.length === 0) {
      throw new HttpErrors.NotFound(messages.songs.NOT_FOUND);
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
  }
);

export const getByUuid = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
    const song = await Songs.getSongByUuid(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound(messages.song.NOT_FOUND);
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
  }
);

export const findSongs = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
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

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const songList = await Songs.findSongs(decodeURI(value.query), value.skip, value.limit);
    if (songList.length === 0) {
      throw new HttpErrors.NotFound(messages.songs.NOT_FOUND);
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
  }
);

export const uploadSong = (): RequestHandler => upload;

export const updateSong = (): RequestHandler => update;

export const deleteSong = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
    const song = await Songs.getSongByUuid(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound(messages.song.NOT_FOUND);
    }

    if ((song.uploadedBy !== req.jwt.uuid) && (req.jwt.role < roles.moderator)) {
      throw new HttpErrors.Forbidden(messages.ACCESS_DENY);
    }

    await Songs.deleteSong(req.params.songId);

    res.status(204).send();
  }
);
