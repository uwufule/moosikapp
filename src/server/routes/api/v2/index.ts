import { Router } from 'express';
import BodyParser from 'body-parser';
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

  router.use(validateAccept());

  // login
  router.post('/login', withAsyncErrorHandler(
    validateContentType('application/json'),
    login(),
  ));

  // refresh tokens
  router.post('/login/refresh', withAsyncErrorHandler(
    refresh(),
  ));

  // logout
  router.post('/logout', withAsyncErrorHandler(
    checkAuth(),
    logout(),
  ));

  // register
  router.post('/register', withAsyncErrorHandler(
    validateContentType('application/json'),
    register(),
  ));

  // restore password
  router.post('/forgot', withAsyncErrorHandler(
    () => {
      throw new HttpErrors.NotImplemented();
    },
  ));

  // get user by username
  router.get('/users/:username', withAsyncErrorHandler(
    checkAuth(),
    users(),
  ));

  // get songs
  router.get('/songs', withAsyncErrorHandler(
    checkAuth(),
    Songs.getSongs(),
  ));

  // search songs
  router.get('/songs/search', withAsyncErrorHandler(
    checkAuth(),
    Songs.findSongs(),
  ));

  // get song by id
  router.get('/songs/:songId', withAsyncErrorHandler(
    checkAuth(),
    Songs.getById(),
  ));

  // upload song
  router.post('/songs', withAsyncErrorHandler(
    validateContentType('audio/mpeg'),
    BodyParser.raw({ type: ['audio/mpeg'], limit: '10MB' }),
    checkAuth(),
    Songs.uploadSong(),
  ));

  // update song (json)
  router.patch('/songs/:songId', withAsyncErrorHandler(
    validateContentType('application/json'),
    checkAuth(),
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
    checkAuth(),
    checkPermissions(roles.moderator),
    Songs.deleteSong(),
  ));

  // get favorite songs
  router.get('/favorites', withAsyncErrorHandler(
    checkAuth(),
    Favorites.getFavoriteSongs(),
  ));

  // add song to favorites
  router.post('/favorites/:songId', withAsyncErrorHandler(
    checkAuth(),
    Favorites.addSongToFavorite(),
  ));

  // remove song from favorites
  router.delete('/favorites/:songId', withAsyncErrorHandler(
    checkAuth(),
    Favorites.removeSongFromFavorite(),
  ));

  // status
  router.get('/status', withAsyncErrorHandler(
    status(),
  ));

  return router;
};
