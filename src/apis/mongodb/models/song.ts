import Mongoose, { Schema } from 'mongoose';
import { Song } from '../../../../typings';

export default Mongoose.model<Song>('Song', new Schema({
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
}, { versionKey: false, timestamps: true }));
