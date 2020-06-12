import Mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid';

const schema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
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
    type: [{ type: String }],
    default: [],
  },
}, { id: false, versionKey: false, timestamps: true });

schema.pre('save', function presave() {
  this.set('likes', [this.get('uploadedBy')]);
});

schema.set('toJSON', {
  transform: (document, object) => {
    const { _id: uuid, ...data } = object;
    return { uuid, ...data };
  },
});

export default Mongoose.model('song', schema);
