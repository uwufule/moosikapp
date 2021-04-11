/* eslint-disable no-underscore-dangle, no-param-reassign */

import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
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
      transform: (doc: any, ret: any) => {
        delete ret._id;
        delete ret.password;
        delete ret.updatedAt;
      },
    });
  }
}

export default UserSchema;
