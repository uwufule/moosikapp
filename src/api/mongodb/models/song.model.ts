import Mongoose, { Schema } from 'mongoose';
import UUID from 'uuid';

const schema = new Schema({
  _id: {
    type: String,
    default: UUID.v4,
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
    type: Array,
    default: [],
  },
}, { id: false, versionKey: false, timestamps: true });

schema.pre('save', function save() {
  this.set('likes', [this.get('uploadedBy')]);
});

schema.set('toJSON', {
  transform: (doc, ret) => {
    const { _id, ...data } = ret;
    return { ...data, uuid: _id };
  },
});

export default Mongoose.model('song', schema);
