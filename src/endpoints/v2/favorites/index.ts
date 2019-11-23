import { Response } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as DB from '../../../apis/mongodb/songs';

import { scopes, roles } from '../../../config.json';
import APIError from '../../../errors/APIError';

interface SongData {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export function getFavoriteSongs() {
  return async (req: AuthorizedRequest, res: Response) => {
    const { scope } = req.query;

    try {
      const skip = Number(req.query.skip);
      if (skip < 0) {
        throw new APIError(400, 'Invalid query parameter `skip` provided.');
      }

      const limit = Number(req.query.limit);
      if (limit < 1 || limit > 100) {
        throw new APIError(400, 'Invalid query parameter `limit` provided.');
      }

      const songList = await DB.getFavoriteSongs(req.jwt.uuid, skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No favorite songs found.');
      }

      const songs: Array<SongData> = [];

      songList.forEach((songItem) => {
        const {
          uuid, author, title, cover, likes, uploadedBy,
        } = songItem;

        const song: SongData = {
          uuid, author, title, cover,
        };

        if (scope & scopes.favorite) {
          song.favorite = likes.includes(req.jwt.uuid);
        }

        if (scope & scopes.edit) {
          song.edit = uploadedBy === req.jwt.uuid || req.jwt.role >= roles.moderator;
        }

        songs.push(song);
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
    try {
      const {
        params: {
          songId,
        },
        jwt: {
          uuid,
        },
      } = req;

      const song = await DB.getSongByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      await DB.updateSong(songId, { $addToSet: { likes: uuid } });

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
    try {
      const {
        params: {
          songId,
        },
        jwt: {
          uuid,
        },
      } = req;

      const song = await DB.getSongByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      if (!song.likes.includes(uuid)) {
        throw new APIError(404, 'No favorite.');
      }

      await DB.updateSong(songId, { $pull: { likes: uuid } });

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
