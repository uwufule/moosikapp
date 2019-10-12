import Mongoose from 'mongoose';

const { MONGODB_CONNECTION_STRING = '' } = process.env;

export default (): void => {
  Mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, autoIndex: false });
}
