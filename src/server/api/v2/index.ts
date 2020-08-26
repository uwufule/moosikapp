import { Router } from 'express';
import BodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import checkAuth from '../../middlewares/authorization';
import checkPermissions from '../../middlewares/permissions';
import { validateAccept, validateContentType } from '../../middlewares/headers';
import { withAsyncErrorHandler } from '../../middlewares/asyncErrorHandler';

import login from './routes/login';
import refresh from './routes/login/refresh';
import logout from './routes/login/logout';
import register from './routes/register';
import users from './routes/users';
import * as Songs from './routes/songs';
import * as Favorites from './routes/favorites';
import status from './routes/status';

import roles from '../../config/roles.json';

export default () => {
  const v2 = Router();

  v2.use(validateAccept());

  // login
  v2.post('/login', withAsyncErrorHandler(validateContentType('application/json'), login()));

  // refresh tokens
  v2.post('/login/refresh', withAsyncErrorHandler(refresh()));

  // logout
  v2.post('/logout', withAsyncErrorHandler(checkAuth(), logout()));

  // register
  v2.post('/register', withAsyncErrorHandler(validateContentType('application/json'), register()));

  // restore password
  v2.post(
    '/forgot',
    withAsyncErrorHandler(() => {
      throw new HttpErrors.NotImplemented();
    }),
  );

  // get user by username
  v2.get('/users/:username', withAsyncErrorHandler(checkAuth(), users()));

  // get songs
  v2.get('/songs', withAsyncErrorHandler(checkAuth(), Songs.getSongs()));

  // search songs
  v2.get('/songs/search', withAsyncErrorHandler(checkAuth(), Songs.findSongs()));

  // get song by id
  v2.get('/songs/:songId', withAsyncErrorHandler(checkAuth(), Songs.getSongById()));

  // upload song
  v2.post(
    '/songs',
    withAsyncErrorHandler(
      validateContentType('audio/mpeg'),
      BodyParser.raw({ type: ['audio/mpeg'], limit: '10MB' }),
      checkAuth(),
      Songs.uploadSong(),
    ),
  );

  // update song (json)
  v2.put(
    '/songs/:songId',
    withAsyncErrorHandler(validateContentType('application/json'), checkAuth(), Songs.updateSong()),
  );

  // update song cover (image/*)
  v2.put(
    '/songs/:songId/cover',
    withAsyncErrorHandler(
      validateContentType('image/png', 'image/jpg', 'image/jpeg', 'image/webp'),
      BodyParser.raw({ type: ['image/*'], limit: '1MB' }),
      checkAuth(),
      Songs.updateSongCover(),
    ),
  );

  // delete song
  v2.delete(
    '/songs/:songId',
    withAsyncErrorHandler(checkAuth(), checkPermissions(roles.moderator), Songs.deleteSong()),
  );

  // get favorite songs
  v2.get('/favorites', withAsyncErrorHandler(checkAuth(), Favorites.getFavoriteSongs()));

  // add song to favorites
  v2.post('/favorites/:songId', withAsyncErrorHandler(checkAuth(), Favorites.addSongToFavorite()));

  // remove song from favorites
  v2.delete(
    '/favorites/:songId',
    withAsyncErrorHandler(checkAuth(), Favorites.removeSongFromFavorite()),
  );

  // status
  v2.get('/status', withAsyncErrorHandler(status()));

  return v2;
};
