import upload from './upload';
import { getFileLink } from '../../apis/yandex-disk';
import {
  getSongs as getSongsFromDB,
  getSongByUuid as getSongByUuidFromDB,
  findSongs as findSongsInDB,
  updateSong as updateSongInDB,
  deleteSong as deleteSongFromDB,
} from '../../apis/mongodb/songs';
import {
  getUserByUuid,
} from '../../apis/mongodb/users';

export function getSongs() {
  return async (req, res) => {
    const { skip, limit, opts = '' } = req.query;

    const s = Number(skip);
    const l = Number(limit);

    if (s < 0) {
      res.status(400).send({ message: 'Invalid query parameter `skip` provided.' });
      return;
    }

    if (l < 1 || l > 100) {
      res.status(400).send({ message: 'Invalid query parameter `limit` provided.' });
      return;
    }

    const userUuid = req.jwt.uuid;

    try {
      const result = await getSongsFromDB(s, l);

      if (!result.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }

      const songs = [];

      result.forEach((song) => {
        const {
          uuid, author, title, cover, likes, uploadedBy,
        } = song.toJSON();

        songs.push({
          uuid,
          author,
          title,
          cover,
          favorite: opts.includes('fav') ? likes.includes(userUuid) : undefined,
          editable: opts.includes('edit') ? uploadedBy === userUuid : undefined,
        });
      });

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

      const editable = song.uploadedBy === req.jwt.uuid;

      const user = await getUserByUuid(song.uploadedBy);
      song.uploadedBy = user.username;

      const {
        author, title, cover, path, uploadedBy, createdAt, likes,
      } = song.toJSON();

      const url = await getFileLink(path);

      res.status(200).send({
        message: 'Successfully retrieved song.',
        song: {
          author,
          title,
          cover,
          url,
          uploadedBy,
          createdAt,
          favorite: likes.includes(),
          editable,
        },
      });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function findSongs() {
  return async (req, res) => {
    const {
      query, skip, limit, opts = '',
    } = req.query;

    if (!query) {
      res.status(400).send({ message: 'No query provided.' });
      return;
    }

    const s = Number(skip);
    const l = Number(limit);

    if (s < 0) {
      res.status(400).send({ message: 'Invalid query parameter `skip` provided.' });
      return;
    }

    if (l < 1 || l > 100) {
      res.status(400).send({ message: 'Invalid query parameter `limit` provided.' });
      return;
    }

    const userUuid = req.jwt.uuid;

    try {
      const result = await findSongsInDB(decodeURI(query), s, l);

      if (!result.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }

      const songs = [];

      result.forEach((song) => {
        const {
          uuid, author, title, cover, likes, uploadedBy,
        } = song.toJSON();

        songs.push({
          uuid,
          author,
          title,
          cover,
          favorite: opts.includes('fav') ? likes.includes(userUuid) : undefined,
          editable: opts.includes('edit') ? uploadedBy === userUuid : undefined,
        });
      });

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

    const { uuid, role } = req.jwt;

    const foundedSong = await getSongByUuidFromDB(songId);

    if (!foundedSong) {
      res.status(404).send({ message: 'No song found.' });
      return;
    }

    if (foundedSong.uploadedBy !== uuid && role < 2) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    const song = {};
    Object.keys(body).forEach((key) => {
      if (['author', 'title', 'cover'].includes(key)) {
        song[key] = body[key].trim();
      }
    });

    try {
      await updateSongInDB(songId, song);
      res.status(200).send({ message: 'Successfully updated song.', song });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function deleteSong() {
  return async (req, res) => {
    try {
      const { songId } = req.params;

      await deleteSongFromDB(songId);

      req.status(204).send();
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
