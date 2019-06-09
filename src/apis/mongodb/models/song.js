import Mongoose from 'mongoose';

const Song = Mongoose.model('Song', new Mongoose.Schema({
  uuid: {
    type: String,
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
  uploadedBy: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'mp3',
  },
  cover: {
    type: String,
    default: null,
  },
}, { versionKey: false, timestamps: true }));

export default Song;
