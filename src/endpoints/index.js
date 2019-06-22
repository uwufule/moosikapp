import checkAuth from '../middlewares/authorization';
import checkPermissions from '../middlewares/permissions';
import { validateAccept, validateContentType } from '../middlewares/headers';

import status from './status';
import login from './login';
import register from './register';
import users from './users';
import {
  getSongs, getSongByUuid, findSongs, uploadSong,
} from './songs';

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

  // get user with provided username
  app.get('/api/users/:username', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    users(),
  ]);

  // get songs
  app.get('/api/songs', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    getSongs(),
  ]);

  // find song
  app.get('/api/songs/find', [
    validateAccept(),
    validateContentType('application/json'),
    checkAuth(),
    findSongs(),
  ]);

  // get song by id
  app.get('/api/songs/:songId', [
    validateAccept(),
    validateContentType('application/json'),
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

  // status
  app.get('/api/status', [
    validateAccept(),
    validateContentType('application/json'),
    status(),
  ]);

  // 404 not found
  app.all('/api/*', (req, res) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });
}
