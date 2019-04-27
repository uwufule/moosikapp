import Mongoose from 'mongoose';


const User = Mongoose.model('User', new Mongoose.Schema({
  uuid: {
    type: String,
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
    time: {
      type: Date,
      default: Date.now(),
    },
  },
  permissions: {
    type: Number,
    default: 1,
  },
  playlists: {
    type: Array,
    default: [],
  },
}, { versionKey: false, timestamps: true }));

export default User;
