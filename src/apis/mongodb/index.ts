import Mongoose, { ConnectionOptions } from 'mongoose';

const { MONGODB_CONNECTION_STRING = '' } = process.env;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
} as ConnectionOptions;

export default async () => {
  await Mongoose.connect(MONGODB_CONNECTION_STRING, connectionOptions);
};
