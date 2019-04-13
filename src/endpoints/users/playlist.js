import Uuid from 'uuid';
import PlaylistModel from '../../apis/mongodb/models/playlist';

export function createPlaylist() {
  return (req, res) => {
    const playlist = new PlaylistModel({
      uuid: Uuid(),
      name: req.body.name,
      private: req.body.isPrivate,
    });
    playlist.save()
      .then((p) => {

      })
      .catch(() => {
        res.status(500).send();
      });
  };
}

export function updatePlaylist() {

}

export function deletePlaylist() {

}

export function getListOfSongs() {

}
