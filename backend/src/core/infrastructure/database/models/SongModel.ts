import Mongoose from 'mongoose';
import ISongModel from '../interfaces/ISongModel';
import SongSchema from './SongSchema';

class SongModel {
  private readonly _modelName = 'song';

  private readonly _songSchema: SongSchema;

  constructor() {
    this._songSchema = new SongSchema();
  }

  public get = () => {
    return Mongoose.model<ISongModel>(this._modelName, this._songSchema);
  };
}

export default SongModel;
