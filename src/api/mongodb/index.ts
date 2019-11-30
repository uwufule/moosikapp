import Mongoose from 'mongoose';

const { MONGODB_CONNECTION_STRING = '' } = process.env;

export default async () => {
  await Mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  });
};
