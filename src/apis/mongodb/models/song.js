import Mongoose from 'mongoose';


const Song = Mongoose.model('Song', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
    default: 'no author',
  },
  title: {
    type: String,
    default: 'no title',
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
  url: {
    type: String,
    default: null,
  },
  coverUrl: {
    type: String,
    default: null,
  },
}, { versionKey: false, timestamps: true }));

export default Song;
