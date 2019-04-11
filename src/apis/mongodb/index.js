import Mongoose from 'mongoose';
import Uuid from 'uuid';
import UserModel from './models/user';
import PlaylistModel from './models/playlist';

export default function () {
  Mongoose.connect('mongodb+srv://root:qhRfNgzxOQWGwA0E@cluster-0-apz1k.mongodb.net/db', { useNewUrlParser: true });
}

function createPlaylist() {
  return new Promise((resolve, reject) => {
    const uuid = Uuid();
    const playlist = new PlaylistModel({ uuid });
    playlist.save()
      .then(p => resolve(p.uuid))
      .catch(reject);
  });
}

function deletePlaylist(playlistId) {
  return new Promise((resolve, reject) => {
    PlaylistModel.deleteOne({ uuid: playlistId })
      .then(resolve)
      .catch(reject);
  });
}

export function updateUser(userId, data) {
  return new Promise((resolve, reject) => {
    UserModel.updateOne({ uuid: userId }, data)
      .then(resolve)
      .catch(reject);
  });
}

export function createUser(username, email, password, permissionLevel = 1) {
  return new Promise(async (resolve, reject) => {
    const uuid = Uuid();
    const user = new UserModel({
      uuid, username, email, password, permissionLevel,
    });
    user.save()
      .then(async (u) => {
        const playlist = await createPlaylist();
        await updateUser(u.uuid, { playlist });
        resolve(u.uuid);
      })
      .catch(reject);
  });
}

export function deleteUser(userId, withPlaylist = true) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ uuid: userId })
      .then(async (user) => {
        if (!user) {
          reject(new Error('No user found.'));
          return;
        }

        if (withPlaylist) {
          await deletePlaylist(user.playlist);
        }

        UserModel.deleteOne({ uuid: userId })
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

deleteUser('f9dfa777-1241-4fb6-8cee-a4b1a2be5e0c')
  .then(console.log)
  .catch(console.error);

export function findByUsername(username) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username })
      .then(resolve)
      .catch(reject);
  });
}

export function findByEmail(email) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email })
      .then(resolve)
      .catch(reject);
  });
}
