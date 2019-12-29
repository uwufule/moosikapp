import { Response } from 'express';
import Joi from '@hapi/joi';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as Songs from '../../../api/mongodb/songs';
import APIError from '../../../errors/APIError';

import scopes from '../../../config/scopes.json';
import roles from '../../../config/roles.json';

interface SongData {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export function getFavoriteSongs() {
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

  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        throw new APIError(400, error.message);
      }

      const { skip, limit, scope } = value;

      const songList = await Songs.getFavoriteSongs(req.jwt.uuid, skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No favorite songs found.');
      }

      const songs = songList.map(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = songData;

        if (scope & scopes.edit) {
          song.edit = (uploadedBy === req.jwt.uuid) || (req.jwt.role >= roles.moderator);
        }

        return song;
      });

      res.status(200).send({ message: 'Successfully retrieved favorite songs.', songs });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send(e.message);
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function addSongToFavorite() {
  return async (req: AuthorizedRequest, res: Response) => {
    const {
      params: {
        songId,
      },
      jwt: {
        uuid,
      },
    } = req;

    try {
      const song = await Songs.getByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      await Songs.updateSong(songId, { $addToSet: { likes: uuid } });

      res.status(200).send({ message: 'Successfully added song to favorites.', uuid: songId });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.statusCode).send({ message: e.message });
        return;
      }

      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function removeSongFromFavorite() {
  return async (req: AuthorizedRequest, res: Response) => {
    const {
      params: {
        songId,
      },
      jwt: {
        uuid,
      },
    } = req;

    try {
      const song = await Songs.getByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      if (!song.likes.includes(uuid)) {
        throw new APIError(404, 'No favorite.');
      }

      await Songs.updateSong(songId, { $pull: { likes: uuid } });

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
