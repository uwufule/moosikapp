import Mongoose from 'mongoose';

const MONGO_URI = String(process.env.MONGO_URI);

export default () =>
  Mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
