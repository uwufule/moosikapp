import Path from 'path';
import Express from 'express';
import BodyParser from 'body-parser';

// import YandexDiskAPI from './apis/yandex-disk';
// import DB from './api/mongodb';

import AuthMiddleware from './middlewares/auth';
import { validateAccept, validateContentType } from './middlewares/validate-headers';

import LoginEndpoint from './endpoints/login';
import RegisterEndpoint from './endpoints/register';
import {
  getUser, getPlaylist, updatePlaylist, removePlaylist,
} from './endpoints/users';
import SongsEndpoint from './endpoints/songs';

const app = Express();
// const yandexDiskApi = new YandexDiskAPI('AQAAAAAkeVfEAAWUdhFEJeYmG0KpgXAZoZ4tHXg');

app.use(Express.static(Path.resolve('./static')));
app.use(BodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(Path.resolve('./html/index.html'));
});

app.post('/login', [
  validateAccept(),
  validateContentType(),
  LoginEndpoint(),
]);

app.post('/register', [
  validateAccept(),
  validateContentType(),
  RegisterEndpoint(),
]);

app.get('/users/:username', [
  validateAccept(),
  AuthMiddleware(),
  getUser(),
]);

app.get('/users/:username/playlist', [
  validateAccept(),
  AuthMiddleware(),
  getPlaylist(),
]);

app.post('/users/:username/playlist', [
  validateAccept(),
  AuthMiddleware(),
  updatePlaylist(),
]);

app.delete('/users/:username/playlist', [
  validateAccept(),
  AuthMiddleware(),
  removePlaylist(),
]);

app.delete('/users/:username/playlist/:songId', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'DeleteSongFromPlaylistError' }),
]);

app.get('/songs', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'GetSongsError' }),
]);

app.put('/songs', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'UploadSongError' }),
]);

app.get('/songs/find', [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'FindSongError' }),
]);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
});


app.listen(process.env.PORT || 8080);
