import Mongoose, { Schema, Document } from 'mongoose';

export interface SongDocument extends Document {
  uuid: string;
  author?: string;
  title?: string;
  cover?: string;
  uploadedBy: string;
  path: string;
  likes: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

export default Mongoose.model<SongDocument>('Song', new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    default: 'No Author',
  },
  title: {
    type: String,
    default: 'No Title',
  },
  cover: {
    type: String,
    default: '',
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
}, { _id: false, versionKey: false, timestamps: true }));
