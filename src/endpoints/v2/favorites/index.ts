/* eslint-disable no-bitwise */

import { Response } from 'express';
import { AuthorizedRequest, Song } from '../../../../typings';
import * as DB from '../../../apis/mongodb/songs';

const { scopes, roles } = require('../../../config.json');

export function getFavoriteSongs() {
  return async (req: AuthorizedRequest, res: Response) => {
    const { skip, limit, scope } = req.query;

    if (skip < 0) {
      res.status(400).send({ message: 'Invalid query parameter `skip` provided.' });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).send({ message: 'Invalid query parameter `limit` provided.' });
      return;
    }

    const user = req.jwt.uuid;

    try {
      const result = await DB.getFavoriteSongs(user, Number(skip), Number(limit));

      if (!result.length) {
        res.status(404).send({ message: 'No favorite songs found.' });
        return;
      }

      const songs: Array<Song> = [];

      result.forEach((song) => {
        const {
          uuid, author, title, cover, uploadedBy,
        } = song.toJSON();

        const canEdit = uploadedBy === user || req.jwt.role >= roles.moderator;

        songs.push(<Song>{
          uuid,
          author,
          title,
          cover,
          edit: scope & scopes.edit ? canEdit : undefined,
        });
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
      const { songId } = req.params;

      const { uuid } = req.jwt;

      const foundedSong = await DB.getSongByUuid(songId);

      if (!foundedSong) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      await DB.updateSong(songId, { $addToSet: { likes: uuid } });

      res.status(200).send({ message: 'Successfully added song to favorites.', uuid: songId });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function removeSongFromFavorite() {
  return async (req: AuthorizedRequest, res: Response) => {
    try {
      const { songId } = req.params;

      const { uuid } = req.jwt;

      const foundedSong = await DB.getSongByUuid(songId);

      if (!foundedSong) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      if (!foundedSong.likes.includes(uuid)) {
        res.status(404).send({ message: 'No favorite found.' });
        return;
      }

      await DB.updateSong(songId, { $pull: { likes: uuid } });

      res.status(204).send();
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
