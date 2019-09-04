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

import { roles } from'../../config.json';

const API_VERSION = 'v2';

export default (app: Application) => {
  app.all(`/api/${API_VERSION}`, (req: Request, res: Response) => {
    res.status(200).send({ message: `There is API${API_VERSION} endpoint.` });
  });

  // login
  app.post(`/api/${API_VERSION}/login`, [
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ]);

  // logout
  app.post(`/api/${API_VERSION}/logout`, [
    validateAccept(),
    (req: Request, res: Response) => {
      res.status(200).send({ message: 'Not implemented.' });
    },
  ]);

  // register
  app.post(`/api/${API_VERSION}/register`, [
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ]);

  // forgot
  app.post(`/api/${API_VERSION}/forgot`, [
    (req: Request, res: Response) => {
      res.status(200).send({ message: 'Not implemented.' });
    },
  ]);

  // get user with provided username
  app.get(`/api/${API_VERSION}/users/:username`, [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get(`/api/${API_VERSION}/songs`, [
    validateAccept(),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get(`/api/${API_VERSION}/songs/find`, [
    validateAccept(),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get(`/api/${API_VERSION}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    getSongByUuid(),
  ]);

  // upload song
  app.post(`/api/${API_VERSION}/songs`, [
    validateAccept(),
    validateContentType(`audio/mpeg`),
    checkAuth(),
    checkPermissions(roles.moderator),
    uploadSong(),
  ]);

  // update song
  app.patch(`/api/${API_VERSION}/songs/:songId`, [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    updateSong(),
  ]);

  // delete song
  app.delete(`/api/${API_VERSION}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    deleteSong(),
  ]);

  // get favorites songs
  app.get(`/api/${API_VERSION}/favorites`, [
    validateAccept(),
    checkAuth(),
    getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post(`/api/${API_VERSION}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete(`/api/${API_VERSION}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    removeSongFromFavorite(),
  ]);

  // status
  app.get(`/api/${API_VERSION}/status`, [
    validateAccept(),
    status(),
  ]);

  // verify upload
  app.get(`/api/${API_VERSION}/verify`, [
    verify(),
  ]);
};
