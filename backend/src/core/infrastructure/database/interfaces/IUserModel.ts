import { Document } from 'mongoose';

interface IUserModel extends Document {
  username: string;
  email: string;
  password: string;
  role?: number;
}

export default IUserModel;
