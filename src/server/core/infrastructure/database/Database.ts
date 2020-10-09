import Mongoose, { ConnectionOptions } from 'mongoose';
import ConfigProvider from '../../services/ConfigProvider';
import SongModel from './models/SongModel';
import TokenModel from './models/TokenModel';
import UserModel from './models/UserModel';

class Database {
  private readonly _configProvider: ConfigProvider;

  public readonly songModelProvider: SongModel;

  public readonly tokenModelProvider: TokenModel;

  public readonly userModelProvider: UserModel;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;

    this.songModelProvider = new SongModel();
    this.tokenModelProvider = new TokenModel();
    this.userModelProvider = new UserModel(this._configProvider);
  }

  public connect = async () => {
    const options: ConnectionOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await Mongoose.connect(this._configProvider.mongoUri, options);
  };
}

export default Database;
