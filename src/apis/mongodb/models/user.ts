import Mongoose, { Schema, Document } from 'mongoose';

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

export default Mongoose.model<UserDocument>('User', new Schema({
  uuid: {
    type: String,
    required: true,
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
