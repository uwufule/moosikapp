import { Model } from 'mongoose';
import ConfigProvider from '../../services/ConfigProvider';
import IUserModel from './interfaces/IUserModel';
import UserModel from './models/UserModel';

class UserCollectionManager {
  private readonly _userModel: Model<IUserModel>;

  constructor(configProvider: ConfigProvider) {
    this._userModel = new UserModel(configProvider).get();
  }

  public add = async (userModelData: IUserModel) => {
    const user = new this._userModel(userModelData);
    await user.save();

    return user.id;
  };

  public get = async (skip: number = 0, limit: number = 100) => {
    const projection = {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    };

    return this._userModel.find({}, projection).skip(skip).limit(limit);
  };

  public getById = (id: string) => {
    const projection = {
      password: 0,
      updatedAt: 0,
    };

    return this._userModel.findById(id, projection);
  };

  public findByUsername = (username: string) => {
    const projection = {
      password: 0,
      updatedAt: 0,
    };

    return this._userModel.findOne({ username }, projection);
  };

  public findByUsernameOrEmail = (usernameOrEmail: string) => {
    return this._userModel.findOne(
      {
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      { id: 1, password: 1, role: 1 },
    );
  };

  public getUsernameById = async (id: string) => {
    return (await this._userModel.findById(id, { username: 1 }))?.username;
  };

  public update = async (id: string, newUserData: any) => {
    const result = await this._userModel.updateOne({ _id: id }, newUserData);
    return !!result.n;
  };

  public delete = async (id: string) => {
    const result = await this._userModel.deleteOne({ _id: id });
    return !!result.n;
  };
}

export default UserCollectionManager;
