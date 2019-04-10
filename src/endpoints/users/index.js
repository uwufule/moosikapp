import {
  getPlaylist, updatePlaylist, removePlaylist,
} from './playlist';

export function getUser() {
  return (req, res) => {
    // database actions

    res.status(200).send({
      email: 'e-mail',
      username: req.params.username,
      playlistId: -1,
    });
  };
}

export {
  getPlaylist,
  updatePlaylist,
  removePlaylist,
};
