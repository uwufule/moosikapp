import { Application, Request, Response } from 'express';
import checkAuth from '../../middlewares/authorization';
import checkPermissions from '../../middlewares/permissions';
import { validateAccept, validateContentType } from '../../middlewares/headers';

import login from './login';
import register from './register';
import users from './users';
import * as Songs from './songs';
import * as Favorites from './favorites';
import { verify } from './songs/upload';
import status from './status';

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
    Songs.getSongs(),
  ]);

  // find song
  app.get(`${API_BASE_URL}/songs/find`, [
    validateAccept(),
    checkAuth(),
    Songs.findSongs(),
  ]);

  // get song by id
  app.get(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    Songs.getByUuid(),
  ]);

  // upload song
  app.post(`${API_BASE_URL}/songs`, [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    Songs.uploadSong(),
  ]);

  // update song
  app.patch(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    Songs.updateSong(),
  ]);

  // delete song
  app.delete(`${API_BASE_URL}/songs/:songId`, [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    Songs.deleteSong(),
  ]);

  // get favorites songs
  app.get(`${API_BASE_URL}/favorites`, [
    validateAccept(),
    checkAuth(),
    Favorites.getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post(`${API_BASE_URL}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    Favorites.addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete(`${API_BASE_URL}/favorites/:songId`, [
    validateAccept(),
    checkAuth(),
    Favorites.removeSongFromFavorite(),
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
