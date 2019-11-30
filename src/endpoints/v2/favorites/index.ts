import { Response } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as Songs from '../../../api/mongodb/songs';
import parseQueryParams from '../../../utils/queryParams';
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
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const { skip, limit, scope } = parseQueryParams(req.query);

      const songList = await Songs.getFavoriteSongs(req.jwt.uuid, skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No favorite songs found.');
      }

      const songs: Array<SongData> = [];
      songList.forEach(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = { ...songData };

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
