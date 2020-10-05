import { Document } from 'mongoose';

interface ISongModel extends Document {
  author?: string;
  title?: string;
  cover?: string;
  uploadedBy: string;
  path: string;
  likes: string[];
}

export default ISongModel;
