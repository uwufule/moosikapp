import Mongoose from 'mongoose';

const { MONGO_URI = '' } = process.env;

export default async () => {
  await Mongoose.connect(
    MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    },
  );
};
