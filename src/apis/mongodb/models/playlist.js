import Mongoose from 'mongoose';


const Playlist = Mongoose.model('Playlist', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    default: 'New Playlist',
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
