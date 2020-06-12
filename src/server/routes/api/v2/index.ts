import { Router } from 'express';
import multer from 'multer';
import HttpErrors from 'http-errors';
import checkAuth from '../../../middlewares/authorization';
import checkPermissions from '../../../middlewares/permissions';
import { validateAccept, validateContentType } from '../../../middlewares/headers';
import { withAsyncErrorHandler } from '../../../middlewares/asyncErrorHandler';

import login from './login';
import refresh from './login/refresh';
import logout from './login/logout';
import register from './register';
import users from './users';
import * as Songs from './songs';
import * as Favorites from './favorites';
import status from './status';

import roles from '../../../config/roles.json';

export default () => {
  const router = Router();

  // login
  router.post('/login', withAsyncErrorHandler(
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ));

  // refresh
  router.post('/login/refresh', withAsyncErrorHandler(
    validateAccept(),
    refresh(),
  ));

  // logout
  router.post('/logout', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    logout(),
  ));

  // register
  router.post('/register', withAsyncErrorHandler(
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ));

  // forgot
  router.post('/forgot', withAsyncErrorHandler(
    () => {
      throw new HttpErrors.NotImplemented();
    },
  ));

  // get user with provided username
  router.get('/users/:username', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    users(),
  ));

  // get songs
  router.get('/songs', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Songs.getSongs(),
  ));

  // song search
  router.get('/songs/search', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Songs.findSongs(),
  ));

  // get song by id
  router.get('/songs/:songId', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Songs.getByUuid(),
  ));

  // upload song
  router.post('/songs', withAsyncErrorHandler(
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    Songs.uploadSong(),
  ));

  // update song
  router.patch('/songs/:songId', withAsyncErrorHandler(
    validateAccept(),
    validateContentType('application/json', 'multipart/form-data'),
    checkAuth(),
    multer().single('cover'),
    Songs.updateSong(),
  ));

  // update song cover (image/*)
  router.put('/songs/:songId/cover', withAsyncErrorHandler(
    validateContentType('image/png', 'image/jpg', 'image/jpeg', 'image/webp'),
    BodyParser.raw({ type: ['image/*'], limit: '1MB' }),
    checkAuth(),
    Songs.updateSongCover(),
  ));

  // delete song
  router.delete('/songs/:songId', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    Songs.deleteSong(),
  ));

  // get favorites songs
  router.get('/favorites', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Favorites.getFavoriteSongs(),
  ));

  // add song to favorites
  router.post('/favorites/:songId', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Favorites.addSongToFavorite(),
  ));

  // remove song from favorites
  router.delete('/favorites/:songId', withAsyncErrorHandler(
    validateAccept(),
    checkAuth(),
    Favorites.removeSongFromFavorite(),
  ));

  // status
  router.get('/status', withAsyncErrorHandler(
    validateAccept(),
    status(),
  ));

  return router;
};
