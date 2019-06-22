import upload from './upload';
import { getFileLink } from '../../apis/yandex-disk';
import {
  getSongs as getSongsFromDB,
  getSongByUuid as getSongByUuidFromDB,
  findSongs as findSongsInDB,
  updateSong as updateSongInDB,
} from '../../apis/mongodb/songs';

export function getSongs() {
  return async (req, res) => {
    const { skip, limit } = req.body;

    try {
      const songs = await getSongsFromDB(skip, limit);

      if (!songs.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function getSongByUuid() {
  return async (req, res) => {
    try {
      const song = await getSongByUuidFromDB(req.params.songId);

      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }

      song.url = await getFileLink(song.url);

      res.status(200).send({ message: 'Successfully retrieved song.', song });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function findSongs() {
  return async (req, res) => {
    const { query } = req.body;

    if (!query) {
      res.status(400).send({ message: 'No query provided.' });
      return;
    }

    try {
      const songs = await findSongsInDB(encodeURI(query));

      if (!songs.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }

      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function uploadSong() {
  return (req, res) => {
    if (!req.body || Number(req.headers['content-length']) === 0) {
      res.status(400).send({ message: 'No body provided.' });
      return;
    }

    upload(req, res);
  };
}

export function updateSong() {
  return async (req, res) => {
    const { body, params: { songId } } = req;

    if (!body) {
      res.status(400).send({ message: 'No body provided.' });
      return;
    }

    const song = await getSongByUuidFromDB(songId);

    if (!song) {
      res.status(404).send({ message: 'No song found.' });
      return;
    }

    const data = {};
    Object.keys(body).forEach((key) => {
      if (['author', 'title', 'cover'].includes(key)) {
        data[key] = body[key];
      }
    });

    try {
      await updateSongInDB(songId, data);
      res.status(200).send({ message: 'Successfully updated song.' });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
