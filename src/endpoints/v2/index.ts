import { Application, Request, Response } from 'express';
import checkAuth from '../../middlewares/authorization';
import checkPermissions from '../../middlewares/permissions';
import { validateAccept, validateContentType } from '../../middlewares/headers';

import status from './status';
import login from './login';
import register from './register';
import users from './users';
import {
  getSongs,
  getSongByUuid,
  findSongs,
  uploadSong,
  updateSong,
  deleteSong,
} from './songs';
import {
  getFavoriteSongs,
  addSongToFavorite,
  removeSongFromFavorite,
} from './favorites';
import { verify } from './songs/upload';

import { roles } from '../../config.json';

const VERSION = 2;

export default (app: Application) => {
  app.all(`/api/v${VERSION}`, (req: Request, res: Response) => {
    res.status(200).send({ message: `There is APIv${VERSION} endpoint.` });
  });

  // login
  app.post(`/api/v${VERSION}/login`, [
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ]);

  // logout
  app.post(`/api/v${VERSION}/logout`, [
    validateAccept(),
    (req: Request, res: Response) => {
      res.status(501).send();
    },
  ]);

  // register
  app.post(`/api/v${VERSION}/register`, [
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ]);

  // forgot
  app.post(`/api/v${VERSION}/forgot`, [
    (req: Request, res: Response) => {
      res.status(501).send();
    },
  ]);

  // get user with provided username
  app.get(`/api/v${VERSION}/users/:username`, [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get(`/api/v${VERSION}/songs`, [
    validateAccept(),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get(`/api/v${VERSION}/songs/find`, [
    validateAccept(),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get(`/api/v${VERSION}/songs/:id`, [
    validateAccept(),
    checkAuth(),
    getSongByUuid(),
  ]);

  // upload song
  app.post(`/api/v${VERSION}/songs`, [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    uploadSong(),
  ]);

  // update song
  app.patch(`/api/v${VERSION}/songs/:id`, [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    updateSong(),
  ]);

  // delete song
  app.delete(`/api/v${VERSION}/songs/:id`, [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    deleteSong(),
  ]);

  // get favorites songs
  app.get(`/api/v${VERSION}/favorites`, [
    validateAccept(),
    checkAuth(),
    getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post(`/api/v${VERSION}/favorites/:id`, [
    validateAccept(),
    checkAuth(),
    addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete(`/api/v${VERSION}/favorites/:id`, [
    validateAccept(),
    checkAuth(),
    removeSongFromFavorite(),
  ]);

  // status
  app.get(`/api/v${VERSION}/status`, [
    validateAccept(),
    status(),
  ]);

  // verify upload
  app.get(`/api/v${VERSION}/verify`, [
    verify(),
  ]);
};
