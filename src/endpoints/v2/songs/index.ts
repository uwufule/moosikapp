/* eslint-disable no-bitwise */

import { Response } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import upload from './upload';
import * as DB from '../../../apis/mongodb/songs';
import { getUserByUuid } from '../../../apis/mongodb/users';

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
      const songList = await DB.getSongs(s, l);

      if (!songList.length) {
        res.status(404).send({ message: 'No songs found.' });
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

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function getSongByUuid() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const song = await DB.getSongByUuid(req.params.id);
      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      const user = await getUserByUuid(song.uploadedBy);

      const username = (user && user.username) || 'deactivated user';

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
          uploadedBy: username,
          createdAt,
          favorite: likes.includes(req.jwt.uuid),
          edit: uploadedBy === req.jwt.uuid,
        },
      });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function findSongs() {
  return async (req: AuthorizedRequest, res: Response) => {
    const {
      query, skip, limit, scope,
    } = req.query;

    if (!query) {
      res.status(400).send({ message: 'No query provided.' });
      return;
    }

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
      const songList = await DB.findSongs(decodeURI(query), s, l);

      if (!songList.length) {
        res.status(404).send({ message: 'No songs found.' });
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

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function uploadSong() {
  return (req: AuthorizedRequest, res: Response) => {
    if (!req.body || Number(req.headers['content-length']) === 0) {
      res.status(400).send({ message: 'No body provided.' });
      return;
    }

    upload(req, res);
  };
}

export function updateSong() {
  return async (req: AuthorizedRequest, res: Response) => {
    const {
      body,
      params: {
        id,
      },
      jwt: {
        uuid, role,
      },
    } = req;

    if (!body) {
      res.status(400).send({ message: 'No body provided.' });
      return;
    }

    const song = await DB.getSongByUuid(id);
    if (!song) {
      res.status(404).send({ message: 'No song found.' });
      return;
    }

    if (song.uploadedBy !== uuid && role < roles.moderator) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    const songData = Object.entries(body).reduce((acc, [key, val]) => {
      if (['author', 'title', 'cover'].includes(key)) {
        acc[key] = String(val);
      }

      return acc;
    }, {} as { [key: string]: string });

    try {
      await DB.updateSong(id, songData);

      res.status(200).send({ message: 'Successfully updated song.', song: songData });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function deleteSong() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const {
        params: {
          id,
        },
        jwt: {
          uuid, role,
        },
      } = req;

      const song = await DB.getSongByUuid(id);

      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      if (song.uploadedBy !== uuid && role < roles.moderator) {
        res.status(403).send({ message: 'Forbitten.' });
        return;
      }

      await DB.deleteSong(id);

      res.status(204).send();
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
