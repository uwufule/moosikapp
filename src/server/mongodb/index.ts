import Mongoose, { ConnectionOptions } from 'mongoose';

const { MONGO_URI } = process.env;

export default async () => {
  const mongoUri = String(MONGO_URI);

  const connectionOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  return Mongoose.connect(mongoUri, connectionOptions);
};
