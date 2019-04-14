import Uuid from 'uuid';
import {
  getPlaylist, createPlaylist, updatePlaylist, deletePlaylist,
} from '../../apis/mongodb/playlists';
import { updateUser } from '../../apis/mongodb/users';


export function getPlaylistEndpoint() {
  return async (req, res) => {
    try {
      const playlist = await getPlaylist(req.params.playlistId);
      if (!playlist) {
        res.status(404).send({ message: 'No playlist found.' });
        return;
      }
      res.status(200).send({ message: 'Successfully retrieved playlist.', playlist });
    } catch (error) {
      res.status(500).send();
    }
  };
}

export function createPlaylistEndpoint() {
  return async (req, res) => {
    try {
      const playlist = await createPlaylist({
        uuid: Uuid(),
        name: req.body.name,
        private: req.body.private,
      });
      await playlist.save();
      await updateUser(req.jwt.uuid, { $push: { playlists: playlist.uuid } });
      res.status(200).send({ message: 'You have successfully created a new playlist.', id: playlist.uuid });
    } catch (error) {
      res.status(500).send();
    }
  };
}

export function updatePlaylistEndpoint() {
  return async (req, res) => {
    try {
      const result = await updatePlaylist(req.params.playlistId, { private: req.body.private });
      if (!result.n) {
        res.status(404).send({ message: 'No playlist found.' });
        return;
      }
      res.status(200).send({ message: 'You have successfully updated playlist.' });
    } catch (error) {
      res.status(500).send();
    }
  };
}

export function deletePlaylistEndpoint() {
  return async (req, res) => {
    try {
      const result = await deletePlaylist(req.params.playlistId);
      if (!result.n) {
        res.status(404).send({ message: 'No playlist found.' });
        return;
      }
      await updateUser(req.jwt.uuid, { $pull: { playlists: req.params.playlistId } });
      res.status(200).send({ message: 'You have successfully deleted playlist.' });
    } catch (error) {
      res.status(500).send();
    }
  };
}

export function addSongEndpoint() {
  return async (req, res) => {
    try {
      if (!req.body.song) {
        res.status(400).send({ message: 'No data provided.' });
        return;
      }
      const result = await updatePlaylist(req.params.playlistId, {
        $push: {
          songlist: req.body.song,
        },
      });
      if (!result.n) {
        res.status(404).send({ message: 'No playlist found.' });
        return;
      }
      res.status(200).send({ message: 'You have successfully added song in playlist.' });
    } catch (error) {
      throw new Error(error);
    }
  };
}

export function deleteSongEndpoint() {
  return async (req, res) => {
    try {
      const result = await updatePlaylist(req.params.playlistId, {
        $pull: {
          songlist: req.params.songId,
        },
      });
      if (!result.n) {
        res.status(404).send({ message: 'No playlist found.' });
        return;
      }
      res.status(200).send({ message: 'You have successfully deleted song from playlist.' });
    } catch (error) {
      throw new Error(error);
    }
  };
}
