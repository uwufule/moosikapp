import { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';

class SongSchema extends Schema {
  constructor() {
    super(
      {
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
      },
      { versionKey: false, timestamps: true },
    );

    super.pre('save', function preSave() {
      this.set('likes', [this.get('uploadedBy')]);
    });
  }
}

export default SongSchema;
