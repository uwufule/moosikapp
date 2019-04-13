import Mongoose from 'mongoose';


const Song = Mongoose.model('Song', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    default: '',
  },
}, { versionKey: false, timestamps: true }));

export default Song;
