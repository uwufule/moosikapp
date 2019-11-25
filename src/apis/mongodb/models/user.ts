/* eslint-disable no-underscore-dangle */

import Mongoose, { Schema, Document } from 'mongoose';
import uuidv4 from 'uuid/v4';

import { roles } from '../../../config.json';

export interface UserDocument extends Document {
  uuid: string;
  username: string;
  email: string;
  password: {
    hash: string;
    timestamp: Date;
  };
  role?: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  username: {
    type: String,
    index: true,
  },
  email: {
    type: String,
    index: true,
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
}, { versionKey: false, timestamps: true });

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const { _id, ...data } = ret;
    return { ...data, uuid: _id };
  },
});

const model = Mongoose.model<UserDocument>('user', schema);

export default model;
