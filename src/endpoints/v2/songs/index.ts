import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import * as Songs from '../../../api/mongodb/songs';
import * as Users from '../../../api/mongodb/users';
import parseQueryParams from '../../../utils/queryParams';
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
    try {
      const { skip, limit, scope } = parseQueryParams(req.query);

      const songList = await Songs.getSongs(skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
      }

      const songs = new Array<SongData>();
      songList.forEach(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = { ...songData };

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

export function getByUuid() {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const song = await Songs.getByUuid(req.params.songId);
      if (!song) {
        throw new APIError(404, 'No song found.');
      }

      const {
        path,
        uploadedBy,
        likes,
        ...songData
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
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        skip, limit, scope, query,
      } = parseQueryParams(req.query);

      const songList = await Songs.findSongs(decodeURI(query), skip, limit);
      if (!songList.length) {
        throw new APIError(404, 'No songs found.');
      }

      const songs: Array<SongData> = [];
      songList.forEach(({ likes, uploadedBy, ...songData }) => {
        const song: SongData = { ...songData };

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

      const songData = Object.entries(body).reduce((acc, [key, val]) => {
        if (['author', 'title', 'cover'].includes(key)) {
          acc[key] = String(val);
        }

        return acc;
      }, {} as { [key: string]: string });

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
