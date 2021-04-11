import { Document } from 'mongoose';

interface ITokenModel extends Document {
  userId: string;
}

export default ITokenModel;
