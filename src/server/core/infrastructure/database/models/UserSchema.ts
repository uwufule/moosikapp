/* eslint-disable no-underscore-dangle, no-param-reassign */

import { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import ConfigProvider from '../../../services/ConfigProvider';

class UserSchema extends Schema {
  constructor(configProvider: ConfigProvider) {
    super(
      {
        _id: {
          type: String,
          default: uuidv4,
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
          type: String,
          required: true,
        },
        role: {
          type: Number,
          default: configProvider.roles.USER,
        },
      },
      { versionKey: false, timestamps: true },
    );

    super.set('toJSON', {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.password;
        delete ret.updatedAt;
      },
    });
  }
}

export default UserSchema;
