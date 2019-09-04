import Mongoose from 'mongoose';
import { IUser } from '../../../../typings';

import { roles } from '../../../config.json';

const User = Mongoose.model<IUser>('User', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    hash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  role: {
    type: Number,
    default: roles.user,
  },
}, { versionKey: false, timestamps: true }));

export default User;
