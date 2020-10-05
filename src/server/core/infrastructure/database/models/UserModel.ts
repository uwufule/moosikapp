import Mongoose from 'mongoose';
import ConfigProvider from '../../../services/ConfigProvider';
import IUserModel from '../interfaces/IUserModel';
import UserShema from './UserSchema';

class UserModel {
  private readonly _modelName = 'user';

  private readonly _userShema: UserShema;

  constructor(configProvider: ConfigProvider) {
    this._userShema = new UserShema(configProvider);
  }

  public get = () => {
    return Mongoose.model<IUserModel>(this._modelName, this._userShema);
  };
}

export default UserModel;
