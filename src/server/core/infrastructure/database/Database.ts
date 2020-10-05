import Mongoose from 'mongoose';
import ConfigProvider from '../../services/ConfigProvider';

class Database {
  private readonly _configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;
  }

  public connect = async () => {
    await Mongoose.connect(this._configProvider.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  };
}

export default Database;
