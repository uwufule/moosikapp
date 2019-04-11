import Mongoose from 'mongoose';

const Playlist = Mongoose.model('Playlist', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  songlist: {
    type: Array,
    default: [],
  },
  private: {
    type: Boolean,
    default: true,
  },
}, { versionKey: false, timestamps: true }));

export default Playlist;
