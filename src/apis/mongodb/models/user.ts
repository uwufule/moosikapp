import Mongoose, { Schema } from 'mongoose';
import { User } from '../../../../typings';

import { roles } from '../../../config.json';

export default Mongoose.model<User>('User', new Schema({
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

