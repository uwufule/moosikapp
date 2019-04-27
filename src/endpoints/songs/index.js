import Upload from './upload';
import {
  getSongs, getSongByUuid, findSong,
} from '../../apis/mongodb/songs';


export function getSongsEndpoint() {
  return async (req, res) => {
    try {
      const songs = await getSongs(req.body.skip, req.body.limit);
      if (!songs.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }
      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send();
    }
  };
}

export function getSongByUuidEndpoint() {
  return async (req, res) => {
    try {
      const song = await getSongByUuid(req.params.songId);
      if (!song) {
        res.status(404).send({ message: 'No song found.' });
        return;
      }
      res.status(200).send({ message: 'Successfully retrieved song.', song });
    } catch (e) {
      res.status(500).send();
    }
  };
}

export function findSongEndpoint() {
  return async (req, res) => {
    try {
      const songs = await findSong(req.body.query);
      if (!songs.length) {
        res.status(404).send({ message: 'No songs found.' });
        return;
      }
      res.status(200).send({ message: 'Successfully retrieved songs.', songs });
    } catch (e) {
      res.status(500).send();
    }
  };
}

export function uploadSongEndpoint() {
  return (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: 'No body provided.' });
      return;
    }

    try {
      Upload(req, res);
    } catch (error) {
      res.status(400).send({ message: 'No data provided.' });
    }
  };
}
