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
  // app.post('/api/forgot', []);

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
  app.put('/api/songs', [
    validateAccept(),
    validateContentType('audio/mpeg'),
    checkAuth(),
    checkPermissions(2),
    uploadSong(),
  ]);

  // update song
  app.patch('/api/songs/:songId', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    checkPermissions(2),
    updateSong(),
  ]);

  // delete song
  app.delete('/api/songs/:songId', [
    validateAccept(),
    checkAuth(),
    checkPermissions(2),
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

  // 404 not found
  app.all('/api/*', (req, res) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });
}
