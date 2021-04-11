import { Model } from 'mongoose';
import Roles from '../../enums/Roles';
import Scopes from '../../enums/Scopes';
import AuthData from '../../models/AuthData';
import ConfigProvider from '../../services/ConfigProvider';
import AggregateSongsOptions from './interfaces/AggregateSongsOptions';
import FindSongsOptions from './interfaces/FindSongsOptions';
import GetSongsOptions from './interfaces/GetSongsOptions';
import ISongModel from './interfaces/ISongModel';
import SongModel from './models/SongModel';

class SongCollectionManager {
  private readonly _songModel: Model<ISongModel>;

  private readonly _configProvider: ConfigProvider;

  constructor(songModelProvider: SongModel, configProvider: ConfigProvider) {
    this._songModel = songModelProvider.get();
    this._configProvider = configProvider;
  }

  public add = async (uploadedBy: string, songPath: string) => {
    const song = new this._songModel({ uploadedBy, path: songPath });
    await song.save();

    return song.id;
  };

  public get = (auth: AuthData, options?: GetSongsOptions) => {
    return this.aggregate(auth, options);
  };

  public getById = async (auth: AuthData, id: string) => {
    const project = {
      _id: 0,
      likes: 0,
      path: 0,
      createdAt: 0,
      updatedAt: 0,
      _uploadedBy: 0,
    };

    const isFavorite = {
      $in: [auth.userId, '$likes'],
    };

    const canEdit = {
      $or: [
        {
          $eq: [auth.userId, '$uploadedBy'],
        },
        {
          $gte: [auth.scope, Roles.ADMIN],
        },
      ],
    };

    const aggregated = await this._songModel
      .aggregate()
      .match({ _id: id })
      .lookup({ from: 'users', localField: 'uploadedBy', foreignField: '_id', as: '_uploadedBy' })
      .unwind('_uploadedBy')
      .addFields({
        id: '$_id',
        url: { $concat: [this._configProvider.cdnServerUri, '$path'] },
        favorite: isFavorite,
        edit: canEdit,
        uploadedBy: {
          id: '$_uploadedBy._id',
          username: '$_uploadedBy.username',
        },
        uploadedAt: '$createdAt',
      })
      .project(project);

    return aggregated[0];
  };

  public getSongOwner = async (songId: string) => {
    const song = await this._songModel.findById(songId);
    return song?.uploadedBy;
  };

  public exists = (songId: string) => {
    return this._songModel.exists({ _id: songId });
  };

  public checkSongInFavorites = (songId: string, userId: string) => {
    return this._songModel.exists({
      $and: [{ _id: songId }, { likes: userId }],
    });
  };

  public getUserFavorites = (auth: AuthData, options?: GetSongsOptions) => {
    const query = {
      likes: auth.userId,
    };

    return this.aggregate(auth, { ...options, query });
  };

  public find = (auth: AuthData, options: FindSongsOptions) => {
    const query = {
      $or: [
        {
          author: {
            $regex: options.query,
            $options: 'i',
          },
        },
        {
          title: {
            $regex: options.query,
            $options: 'i',
          },
        },
      ],
    };

    return this.aggregate(auth, { ...options, query });
  };

  public update = async (id: string, newSongModelData: any) => {
    const result = await this._songModel.updateOne({ _id: id }, newSongModelData);
    return !!result.n;
  };

  public delete = async (id: string) => {
    const result = await this._songModel.deleteOne({ _id: id });
    return !!result.n;
  };

  private aggregate = (auth: AuthData, options?: AggregateSongsOptions) => {
    const skip = options?.skip ?? 0;
    const limit = options?.limit ?? 100;

    const favorite = (options?.scope ?? 0) & Scopes.FAVORITE;
    const edit = (options?.scope ?? 0) & Scopes.EDIT;

    const addFields: any = {
      id: '$_id',
    };

    if (favorite) {
      addFields.favorite = {
        $in: [auth.userId, '$likes'],
      };
    }

    if (edit) {
      addFields.edit = {
        $or: [
          {
            $eq: [auth.userId, '$uploadedBy'],
          },
          auth.scope >= Roles.ADMIN,
        ],
      };
    }

    return this._songModel
      .aggregate()
      .match(options?.query ?? {})
      .skip(skip)
      .limit(limit)
      .addFields(addFields)
      .sort({ createdAt: -1 })
      .project({ _id: 0, likes: 0, path: 0, uploadedBy: 0, createdAt: 0, updatedAt: 0 });
  };
}

export default SongCollectionManager;
