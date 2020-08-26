import Mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid';

const schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default Mongoose.model('refreshtoken', schema);
