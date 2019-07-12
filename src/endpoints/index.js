import checkAuth from '../middlewares/authorization';
import checkPermissions from '../middlewares/permissions';
import { validateAccept, validateContentType } from '../middlewares/headers';

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
import { upload, verify } from './upload';

const { roles } = require('../config.json');

export default function (app) {
  app.all('/api', (req, res) => {
    res.status(200).send({ message: 'There is API endpoint.' });
  });

  // login
  app.post('/api/login', [
    validateAccept(),
    validateContentType('application/json'),
    login(),
  ]);

  // register
  app.post('/api/register', [
    validateAccept(),
    validateContentType('application/json'),
    register(),
  ]);

  // forgot
  app.post('/api/forgot', [
    (req, res) => {
      res.status(200).send({ message: 'Not implemented.' });
    },
  ]);

  // get user with provided username
  app.get('/api/users/:username', [
    validateAccept(),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get('/api/songs', [
    validateAccept(),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get('/api/songs/find', [
    validateAccept(),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get('/api/songs/:songId', [
    validateAccept(),
    checkAuth(),
    getSongByUuid(),
  ]);

  // upload song
  app.post('/api/songs', [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    uploadSong(),
  ]);

  // update song
  app.patch('/api/songs/:songId', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    updateSong(),
  ]);

  // delete song
  app.delete('/api/songs/:songId', [
    validateAccept(),
    checkAuth(),
    checkPermissions(roles.moderator),
    deleteSong(),
  ]);

  // get favorites songs
  app.get('/api/favorites', [
    validateAccept(),
    checkAuth(),
    getFavoriteSongs(),
  ]);

  // add song to favorites
  app.post('/api/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    addSongToFavorite(),
  ]);

  // remove song from favorites
  app.delete('/api/favorites/:songId', [
    validateAccept(),
    checkAuth(),
    removeSongFromFavorite(),
  ]);

  // status
  app.get('/api/status', [
    validateAccept(),
    status(),
  ]);


  /* experimental */

  // upload song
  app.get('/api/upload', [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(roles.moderator),
    upload(),
  ]);

  // verify upload
  app.get('/api/upload/verify', [
    verify(),
  ]);

  /* experimental */


  // 404 not found
  app.all('/api/*', (req, res) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });
}
