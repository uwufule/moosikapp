import Path from 'path';
import Express from 'express';
import BodyParser from 'body-parser';

import MongoDB from './apis/mongodb';

import AuthMiddleware from './middlewares/auth';
import { validateAccept, validateContentType } from './middlewares/validate-headers';

import LoginEndpoint from './endpoints/login';
import RegisterEndpoint from './endpoints/register';
import {
  getSongsListener, getSongByUuidListener, uploadSongListener, findSongListener,
} from './endpoints/songs';
import GetUserEndpoint from './endpoints/users';

MongoDB();

const app = Express();

app.use(Express.static(Path.resolve('./static')));
app.use(BodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(Path.resolve('./html/index.html'));
});

// login
app.post('/api/login', [
  validateAccept(),
  validateContentType('application/json'),
  LoginEndpoint(),
]);

// register
app.post('/api/register', [
  validateAccept(),
  validateContentType('application/json'),
  RegisterEndpoint(),
]);

// get user with provided username
app.get('/api/users/:username', [
  validateAccept(),
  AuthMiddleware(),
  GetUserEndpoint(),
]);

// create new playlist *
app.post('/api/users/:username/playlists', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
]);

// get songs in playlist *
app.get('/api/users/:username/playlists/:playlistId', [
  validateAccept(),
  AuthMiddleware(),
]);

// update playlist *
app.patch('/api/users/:username/playlists/:playlistId', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'PatchPlaylistError' }),
]);

// delete playlist *
app.delete('/api/users/:username/playlists/:playlistId', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'DeletePlaylistError' }),
]);

// get song list
app.get('/api/songs', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  getSongsListener(),
]);

// find song
app.get('/api/songs/find', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  findSongListener(),
]);

// get song by id
app.get('/api/songs/:songId', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  getSongByUuidListener(),
]);

// upload song
app.put('/api/songs', [
  validateAccept(),
  // validateContentType('multipart/form-data'),
  AuthMiddleware(),
  uploadSongListener(),
]);

app.all('/api*', (req, res) => {
  res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
});


app.listen(process.env.PORT || 8080);
