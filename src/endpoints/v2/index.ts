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

const API_VERSION = 2;
const API_BASE_URL = `/api/v${API_VERSION}`;

export default (app: Application) => {
  app.all(API_BASE_URL, (req: Request, res: Response) => {
    res.status(200).send({ message: `There is APIv${API_VERSION} endpoint.` });
  });

  // login
  app.post(`${API_BASE_URL}/login`, [
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ]);

  // logout
  app.post(`${API_BASE_URL}/logout`, [
    validateAccept(),
    (req: Request, res: Response) => {
      res.status(501).send();
    },
  ]);

  // register
  app.post(`${API_BASE_URL}/register`, [
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ]);

  // forgot
  app.post(`${API_BASE_URL}/forgot`, [
    (req: Request, res: Response) => {
      res.status(501).send();
    },
  ]);

  // get user with provided username
  app.get(`${API_BASE_URL}/users/:username`, [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get(`${API_BASE_URL}/songs`, [
    validateAccept(),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get(`${API_BASE_URL}/songs/find`, [
    validateAccept(),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    getSongByUuid(),
  ]);

  // upload song
  app.post(`${API_BASE_URL}/songs`, [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    uploadSong(),
  ]);

  // update song
  app.patch(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    updateSong(),
  ]);

  // delete song
  app.delete(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    deleteSong(),
  ]);

  // get favorites songs
  app.get(`${API_BASE_URL}/favorites`, [
    validateAccept(),
    checkAuth(),
    getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post(`${API_BASE_URL}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete(`${API_BASE_URL}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    removeSongFromFavorite(),
  ]);

  // status
  app.get(`${API_BASE_URL}/status`, [
    validateAccept(),
    status(),
  ]);

  // verify upload
  app.get(`${API_BASE_URL}/verify`, [
    verify(),
  ]);
};
