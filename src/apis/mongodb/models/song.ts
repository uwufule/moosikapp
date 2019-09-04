import Mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import { ISong } from '../../../../typings';

const Song = Mongoose.model<ISong>('Song', new Schema({
  uuid: {
    type: String,
    default: uuidv4(),
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
}, { versionKey: false, timestamps: true }));

export default Song;
