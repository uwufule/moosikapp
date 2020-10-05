import { Model } from 'mongoose';
import ITokenModel from './interfaces/ITokenModel';
import TokenModel from './models/TokenModel';

class TokenCollectionManager {
  private readonly _tokenModel: Model<ITokenModel>;

  constructor() {
    this._tokenModel = new TokenModel().get();
  }

  public add = async (userId: string) => {
    const refreshToken = new this._tokenModel({ userId });
    await refreshToken.save();

    return refreshToken.id;
  };

  public delete = async (id: string) => {
    const result = await this._tokenModel.deleteOne({ _id: id });
    return !!result.n;
  };

  public deleteForUser = async (userId: string) => {
    const result = await this._tokenModel.deleteMany({ userId });
    return !!result.n;
  };

  public has = (id: string) => {
    return this._tokenModel.exists({ _id: id });
  };
}

export default TokenCollectionManager;
