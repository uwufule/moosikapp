import Mongoose from 'mongoose';
import UserModel from './models/user';

const { MONGODB_CONNECTION_STRING } = process.env;

export default function () {
  Mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, autoIndex: false });
}

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
