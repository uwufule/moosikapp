import Mongoose from 'mongoose';

const { MONGO_URI } = process.env;

export default () => (
  Mongoose.connect(String(MONGO_URI), {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
  })
);
