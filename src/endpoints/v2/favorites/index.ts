import { Response, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as Songs from '../../../api/mongodb/songs';

import scopes from '../../../config/scopes.json';
import roles from '../../../config/roles.json';

import messages from './messages.json';

interface SongData {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export const getFavoriteSongs = (): RequestHandler => (
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

    const songList = await Songs.getFavoriteSongs(req.jwt.uuid, value.skip, value.limit);
    if (!songList.length) {
      throw new HttpErrors.NotFound(messages.NO_FAVORITES_FOUND);
    }

    const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
      const song: SongData = songData;

      if (value.scope & scopes.edit) {
        song.edit = (uploadedBy === req.jwt.uuid) || (req.jwt.role >= roles.moderator);
      }

      return song;
    });

    res.status(200).send({ message: messages.SUCCESS, songs });
  }
);

export const addSongToFavorite = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
    const song = await Songs.getSongByUuid(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound(messages.NO_SONG_FOUND);
    }

    await Songs.updateSong(req.params.songId, { $addToSet: { likes: req.jwt.uuid } });

    res.status(200).send({ message: messages.SUCCESSFULLY_ADDED, uuid: req.params.songId });
  }
);

export const removeSongFromFavorite = (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response) => {
    const song = await Songs.getSongByUuid(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound(messages.NO_SONG_FOUND);
    }

    if (!song.likes.includes(req.jwt.uuid)) {
      throw new HttpErrors.NotFound(messages.NO_FAVORITE);
    }

    await Songs.updateSong(req.params.songId, { $pull: { likes: req.jwt.uuid } });

    res.status(204).send();
  }
);
