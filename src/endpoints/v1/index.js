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

const { roles } = require('../../config.json');

export default (app) => {
  app.all('/api/v1', (req, res) => {
    res.status(200).send({ message: 'There is APIv1 endpoint.' });
  });

  // login
  app.post('/api/v1/login', [
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ]);

  // logout
  app.post('/api/v1/logout', []);

  // register
  app.post('/api/v1/register', [
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ]);

  // forgot
  app.post('/api/v1/forgot', [
    (req, res) => {
      res.status(200).send({ message: 'Not implemented.' });
    },
  ]);

  // get user with provided username
  app.get('/api/v1/users/:username', [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get('/api/v1/songs', [
    validateAccept(),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get('/api/v1/songs/find', [
    validateAccept(),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get('/api/v1/songs/:songId', [
    validateAccept(),
    checkAuth(),
    getSongByUuid(),
  ]);

  // upload song
  app.post('/api/v1/songs', [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    uploadSong(),
  ]);

  // update song
  app.patch('/api/v1/songs/:songId', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    updateSong(),
  ]);

  // delete song
  app.delete('/api/v1/songs/:songId', [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    deleteSong(),
  ]);

  // get favorites songs
  app.get('/api/v1/favorites', [
    validateAccept(),
    checkAuth(),
    getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post('/api/v1/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete('/api/v1/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    removeSongFromFavorite(),
  ]);

  // status
  app.get('/api/v1/status', [
    validateAccept(),
    status(),
  ]);

  // verify upload
  app.get('/api/v1/verify', [
    verify(),
  ]);
};
