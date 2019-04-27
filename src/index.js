import Path from 'path';
import Express from 'express';
import BodyParser from 'body-parser';

import YandexDiskApi from './apis/yandex-disk';
import MongoDB from './apis/mongodb';

import AuthMiddleware from './middlewares/authorization';
import {
  validateAccept,
  validateContentType,
} from './middlewares/headers';
import MinimumPermissionLevelRequired from './middlewares/permissions';

import LoginEndpoint from './endpoints/login';
import RegisterEndpoint from './endpoints/register';
import {
  getSongsEndpoint,
  getSongByUuidEndpoint,
  uploadSongEndpoint,
  findSongEndpoint,
} from './endpoints/songs';
import GetUserEndpoint from './endpoints/users';
import {
  getPlaylistEndpoint,
  createPlaylistEndpoint,
  updatePlaylistEndpoint,
  deletePlaylistEndpoint,
  addSongEndpoint,
  deleteSongEndpoint,
} from './endpoints/users/playlist';


YandexDiskApi(process.env.YANDEX_DISK_API_TOKEN);
MongoDB();


const app = Express();


app.use(Express.static(Path.resolve('./static')));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: '10mb' }));

app.use((error, req, res, next) => {
  if (!error) next();

  switch (error.message) {
    case 'request entity too large':
      res.send({ message: 'File too large.' });
      break;
    default:
      res.status(500).send();
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

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

// create new playlist
app.post('/api/playlists', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  createPlaylistEndpoint(),
]);

// get playlist
app.get('/api/playlists/:playlistId', [
  validateAccept(),
  AuthMiddleware(),
  getPlaylistEndpoint(),
]);

// update playlist
app.patch('/api/playlists/:playlistId', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  updatePlaylistEndpoint(),
]);

// delete playlist
app.delete('/api/playlists/:playlistId', [
  validateAccept(),
  AuthMiddleware(),
  deletePlaylistEndpoint(),
]);

// add song in playlist
app.put('/api/playlists/:playlistId', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  addSongEndpoint(),
]);

// delete song from playlist
app.delete('/api/playlists/:playlistId/:songId', [
  validateAccept(),
  AuthMiddleware(),
  deleteSongEndpoint(),
]);

// get song list
app.get('/api/songs', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  getSongsEndpoint(),
]);

// find song
app.get('/api/songs/find', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  findSongEndpoint(),
]);

// get song by id
app.get('/api/songs/:songId', [
  validateAccept(),
  validateContentType('application/json'),
  AuthMiddleware(),
  getSongByUuidEndpoint(),
]);

// upload song
app.put('/api/songs', [
  validateAccept(),
  validateContentType('audio/mpeg'),
  AuthMiddleware(),
  MinimumPermissionLevelRequired(2),
  uploadSongEndpoint(),
]);

// 404 not found
app.all('/api*', (req, res) => {
  res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
});


app.listen(process.env.PORT || 8080);
