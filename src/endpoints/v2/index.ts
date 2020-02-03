import { Router, Request, Response } from 'express';
import multer from 'multer';
import checkAuth from '../../middlewares/authorization';
import checkPermissions from '../../middlewares/permissions';
import { validateAccept, validateContentType } from '../../middlewares/headers';

import login from './login';
import refresh from './login/refresh';
import logout from './login/logout';
import register from './register';
import users from './users';
import * as Songs from './songs';
import * as Favorites from './favorites';
import status from './status';

import roles from '../../config/roles.json';

export default () => {
  const router = Router();

  router.all('/', (req: Request, res: Response) => {
    res.status(200).send({ message: 'There is APIv2 endpoint.' });
  });

  // login
  router.post('/login', [
    validateAccept(),
    validateContentType('routerlication/json'),
    login(),
  ]);

  // refresh token using refreshToken
  router.get('/login/refresh', [
    validateAccept(),
    refresh(),
  ]);

  // logout
  router.post('/logout', [
    validateAccept(),
    checkAuth(),
    logout(),
  ]);

  // register
  router.post('/register', [
    validateAccept(),
    validateContentType('routerlication/json'),
    register(),
  ]);

  // forgot
  router.post('/forgot', [
    (req: Request, res: Response) => {
      res.status(501).send();
    },
  ]);

  // get user with provided username
  router.get('/users/:username', [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  router.get('/songs', [
    validateAccept(),
    checkAuth(),
    Songs.getSongs(),
  ]);

  // find song
  router.get('/songs/find', [
    validateAccept(),
    checkAuth(),
    Songs.findSongs(),
  ]);

  // get song by id
  router.get('/songs/:songId', [
    validateAccept(),
    checkAuth(),
    Songs.getByUuid(),
  ]);

  // upload song
  router.post('/songs', [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    Songs.uploadSong(),
  ]);

  // update song
  router.patch('/songs/:songId', [
    validateAccept(),
    validateContentType(['routerlication/json', 'multipart/form-data']),
    checkAuth(),
    multer().single('cover'),
    Songs.updateSong(),
  ]);

  // delete song
  router.delete('/songs/:songId', [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    Songs.deleteSong(),
  ]);

  // get favorites songs
  router.get('/favorites', [
    validateAccept(),
    checkAuth(),
    Favorites.getFavoriteSongs(),
  ]);

  // add song to favorites
  router.post('/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    Favorites.addSongToFavorite(),
  ]);

  // remove song from favorites
  router.delete('/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    Favorites.removeSongFromFavorite(),
  ]);

  // status
  router.get('/status', [
    validateAccept(),
    status(),
  ]);

  return router;
};
