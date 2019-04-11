import Path from 'path';
import Express from 'express';
import BodyParser from 'body-parser';

// import YandexDiskAPI from './apis/yandex-disk';
import MongoDB from './apis/mongodb';

import AuthMiddleware from './middlewares/auth';
import { validateAccept, validateContentType } from './middlewares/validate-headers';

import LoginEndpoint from './endpoints/login';
import RegisterEndpoint from './endpoints/register';
import {
  getUser, getPlaylist, updatePlaylist, removePlaylist,
} from './endpoints/users';
// import SongsEndpoint from './endpoints/songs';

MongoDB();

const API_ENDPOINT = '/api';

const app = Express();
// const yandexDiskApi = new YandexDiskAPI('AQAAAAAkeVfEAAWUdhFEJeYmG0KpgXAZoZ4tHXg');

app.use(Express.static(Path.resolve('./static')));
app.use(BodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(Path.resolve('./html/index.html'));
});

app.post(`${API_ENDPOINT}/login`, [
  validateAccept(),
  validateContentType(),
  LoginEndpoint(),
]);

app.post(`${API_ENDPOINT}/register`, [
  validateAccept(),
  validateContentType(),
  RegisterEndpoint(),
]);

app.get(`${API_ENDPOINT}/users/:username`, [
  validateAccept(),
  AuthMiddleware(),
  getUser(),
]);

app.get(`${API_ENDPOINT}/users/:username/playlist`, [
  validateAccept(),
  AuthMiddleware(),
  getPlaylist(),
]);

app.post(`${API_ENDPOINT}/users/:username/playlist`, [
  validateAccept(),
  AuthMiddleware(),
  updatePlaylist(),
]);

app.delete(`${API_ENDPOINT}/users/:username/playlist`, [
  validateAccept(),
  AuthMiddleware(),
  removePlaylist(),
]);

app.delete(`${API_ENDPOINT}/users/:username/playlist/:songId`, [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'DeleteSongFromPlaylistError' }),
]);

app.get(`${API_ENDPOINT}/songs`, [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'GetSongsError' }),
]);

app.put(`${API_ENDPOINT}/songs`, [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'UploadSongError' }),
]);

app.get(`${API_ENDPOINT}/songs/find`, [
  validateAccept(),
  AuthMiddleware(),
  (req, res) => res.status(500).send({ error: 'FindSongError' }),
]);

app.all(`${API_ENDPOINT}*`, (req, res) => {
  res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
});


app.listen(process.env.PORT || 8080);
