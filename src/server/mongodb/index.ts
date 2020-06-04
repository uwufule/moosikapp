import Mongoose from 'mongoose';

const { MONGO_URI } = process.env;

export default () => {
  const uri = String(MONGO_URI);

  return Mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
