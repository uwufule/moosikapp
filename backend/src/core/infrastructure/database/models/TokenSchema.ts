import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

class TokenSchema extends Schema {
  constructor() {
    super(
      {
        _id: {
          type: String,
          default: uuidv4,
        },
        userId: {
          type: String,
          required: true,
          ref: 'user',
        },
      },
      { versionKey: false },
    );
  }
}

export default TokenSchema;
