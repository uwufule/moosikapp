/* eslint-disable no-bitwise */

import { Response } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as DB from '../../../apis/mongodb/songs';

import { scopes, roles } from '../../../config.json';

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
    const { skip, limit, scope } = req.query;

    const s = Number(skip);
    if (s < 0) {
      res.status(400).send({ message: 'Invalid query parameter `skip` provided.' });
      return;
    }

    const l = Number(limit);
    if (l < 1 || l > 100) {
      res.status(400).send({ message: 'Invalid query parameter `limit` provided.' });
      return;
    }

    try {
      const songList = await DB.getFavoriteSongs(req.jwt.uuid, s, l);

      if (!songList.length) {
        res.status(404).send({ message: 'No favorite songs found.' });
        return;
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
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function addSongToFavorite() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const {
        params: {
          id,
        },
        jwt: {
          uuid,
        },
      } = req;

      const song = await DB.getSongByUuid(id);
      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      await DB.updateSong(id, { $addToSet: { likes: uuid } });

      res.status(200).send({ message: 'Successfully added song to favorites.', uuid: id });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function removeSongFromFavorite() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const {
        params: {
          id,
        },
        jwt: {
          uuid,
        },
      } = req;

      const song = await DB.getSongByUuid(id);
      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      if (!song.likes.includes(uuid)) {
        res.status(404).send({ message: 'No favorite.' });
        return;
      }

      await DB.updateSong(id, { $pull: { likes: uuid } });

      res.status(204).send();
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
