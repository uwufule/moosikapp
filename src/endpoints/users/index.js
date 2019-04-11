import UserModel from '../../apis/mongodb/models/user';

import {
  getPlaylist, updatePlaylist, removePlaylist,
} from './playlist';

export function getUser() {
  return (req, res) => {
    UserModel.findOne({ username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'No user found.' });
          return;
        }
        res.status(200).send({
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          permissionLevel: user.permissionLevel,
          createdAt: user.createdAt,
          playlist: user.playlist,
        });
      })
      .catch(() => {
        res.status(500).send();
      });
  };
}

export {
  getPlaylist,
  updatePlaylist,
  removePlaylist,
};
