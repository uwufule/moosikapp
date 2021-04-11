import Mongoose from 'mongoose';
import ITokenModel from '../interfaces/ITokenModel';
import TokenSchema from './TokenSchema';

class TokenModel {
  private readonly _modelName = 'refreshtoken';

  private readonly _tokenShema: TokenSchema;

  constructor() {
    this._tokenShema = new TokenSchema();
  }

  public get = () => {
    return Mongoose.model<ITokenModel>(this._modelName, this._tokenShema);
  };
}

export default TokenModel;
