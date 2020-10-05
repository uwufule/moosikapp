import { Document } from 'mongoose';

interface IRefreshTokenModel extends Document {
  userId: string;
}

export default IRefreshTokenModel;
