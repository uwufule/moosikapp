import Mongoose, { Schema } from 'mongoose';
import UUID from 'uuid';

import roles from '../../../config/roles.json';

const schema = new Schema({
  _id: {
    type: String,
    default: UUID.v4,
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
  passwordRecord: {
    hash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  role: {
    type: Number,
    default: roles.user,
  },
}, { id: false, versionKey: false, timestamps: true });

schema.virtual('password')
  .get(function () {
    return this.passwordRecord.hash;
  })
  .set(function (hash: string) {
    this.set('passwordRecord.hash', hash);
  });

schema.virtual('passwordTimestamp')
  .get(function () {
    return this.passwordRecord.timestamp;
  })
  .set(function (timestamp: Date) {
    this.set('passwordRecord.timestamp', timestamp);
  });

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const { _id, ...data } = ret;

    delete data.passwordRecord;

    return { ...data, uuid: _id };
  },
});

export default Mongoose.model('user', schema);
