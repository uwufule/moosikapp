import Mongoose, { Schema } from 'mongoose';
import UUID from 'uuid';

const schema = new Schema({
  _id: {
    type: String,
    default: UUID.v4,
  },
  userId: {
    type: String,
    required: true,
  },
  hex: {
    type: String,
    required: true,
    unique: true,
  },
}, { versionKey: false });

export default Mongoose.model('token', schema);
