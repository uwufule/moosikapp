import Mongoose from 'mongoose';

const { MONGODB_CONNECTION_STRING = '' } = process.env;

export default () => {
  Mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, autoIndex: false });
}
