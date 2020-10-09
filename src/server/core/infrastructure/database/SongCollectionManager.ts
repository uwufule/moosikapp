import { Model } from 'mongoose';
import ISongModel from './interfaces/ISongModel';
import SongModel from './models/SongModel';

class SongCollectionManager {
  private readonly _songModel: Model<ISongModel>;

  constructor(songModelProvider: SongModel) {
    this._songModel = songModelProvider.get();
  }

  public add = async (uploadedBy: string, songPath: string) => {
    const song = new this._songModel({ uploadedBy, path: songPath });
    await song.save();

    return song.id;
  };

  public get = async (skip: number = 0, limit: number = 100) => {
    const projection = {
      _id: 1,
      author: 1,
      title: 1,
      cover: 1,
      uploadedBy: 1,
      likes: 1,
    };

    return this._songModel.find({}, projection).skip(skip).limit(limit);
  };

  public getById = (id: string) => {
    const projection = {
      _id: 1,
      author: 1,
      title: 1,
      cover: 1,
      uploadedBy: 1,
      likes: 1,
      path: 1,
      createdAt: 1,
    };

    return this._songModel.findById(id, projection);
  };

  public getUserFavorites = (userId: string, skip: number = 0, limit: number = 100) => {
    const projection = {
      _id: 1,
      author: 1,
      title: 1,
      cover: 1,
      uploadedBy: 1,
      likes: 1,
    };

    const query = {
      likes: userId,
    };

    return this._songModel.find(query, projection).skip(skip).limit(limit);
  };

  public find = (queryString: string, skip: number = 0, limit: number = 100) => {
    const projection = {
      _id: 1,
      author: 1,
      title: 1,
      cover: 1,
      uploadedBy: 1,
      likes: 1,
    };

    const query = {
      $or: [
        {
          author: {
            $regex: queryString,
            $options: 'i',
          },
        },
        {
          title: {
            $regex: queryString,
            $options: 'i',
          },
        },
      ],
    };

    return this._songModel.find(query, projection).skip(skip).limit(limit);
  };

  public update = async (id: string, newSongModelData: any) => {
    const result = await this._songModel.updateOne({ _id: id }, newSongModelData);
    return !!result.n;
  };

  public delete = async (id: string) => {
    const result = await this._songModel.deleteOne({ _id: id });
    return !!result.n;
  };
}

export default SongCollectionManager;
