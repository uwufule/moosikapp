import Mongoose from 'mongoose';

const User = Mongoose.model('User', new Mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  permissionLevel: {
    type: Number,
    default: 1,
  },
  playlist: {
    type: String,
    default: '',
  },
}, { versionKey: false, timestamps: true }));

export default User;
