import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import * as DB from '../../../apis/mongodb/songs';
import { getUserByUuid } from '../../../apis/mongodb/users';
import APIError from '../../../errors/APIError';

import { scopes, roles } from '../../../config.json';

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
    const { scope } = req.query;

    const skip = Number(req.query.skip);
    if (skip < 0) {
      next(new APIError(400, 'Invalid query parameter `skip` provided.'));
      return;
    }

    const limit = Number(req.query.limit);
    if (limit < 1 || limit > 100) {
      next(new APIError(400, 'Invalid query parameter `limit` provided.'));
      return;
    }

    try {
      const songList = await DB.getSongs(skip, limit);

      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
      }

      const songs: Array<SongData> = [];

      songList.forEach(({
        uuid, author, title, cover, likes, uploadedBy,
      }) => {
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

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      next(e);
    }
  };
}

export function getSongByUuid() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const song = await DB.getSongByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      const user = await getUserByUuid(song.uploadedBy);

      const {
        uuid, author, title, cover, path, uploadedBy, likes, createdAt,
      } = song;

      res.status(200).send({
        message: 'Successfully retrieved song.',
        song: {
          uuid,
          author,
          title,
          cover,
          url: `${CDN_SERVER}${path}`,
          uploadedBy: user ? user.username : 'deactivated user',
          createdAt,
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
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const { query, scope } = req.query;

    if (!query) {
      next(new APIError(400, 'No query provided.'));
      return;
    }

    const skip = Number(req.query.skip);
    if (skip < 0) {
      next(new APIError(400, 'Invalid query parameter `skip` provided.'));
      return;
    }

    const limit = Number(req.query.limit);
    if (limit < 1 || limit > 100) {
      next(new APIError(400, 'Invalid query parameter `limit` provided.'));
      return;
    }

    try {
      const songList = await DB.findSongs(decodeURI(query), skip, limit);

      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
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

    if (!body) {
      next(new APIError(400, 'No body provided.'));
      return;
    }

    const song = await DB.getSongByUuid(songId);
    if (!song) {
      next(new APIError(404, 'No song found.'));
      return;
    }

    if (song.uploadedBy !== uuid && role < roles.moderator) {
      next(new APIError(403, 'Forbitten.'));
      return;
    }

    const songData = Object.entries(body).reduce((acc, [key, val]) => {
      if (['author', 'title', 'cover'].includes(key)) {
        acc[key] = String(val);
      }

      return acc;
    }, {} as { [key: string]: string });

    try {
      await DB.updateSong(songId, songData);

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
      const song = await DB.getSongByUuid(songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      if (song.uploadedBy !== uuid && role < roles.moderator) {
        throw new APIError(403, 'Forbitten.');
      }

      await DB.deleteSong(songId);

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
