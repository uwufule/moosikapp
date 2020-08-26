import Mongoose from 'mongoose';

const MONGO_URI = String(process.env.MONGO_URI);

class MongoDB {
  public static connect = () =>
    Mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
}

export default MongoDB;
