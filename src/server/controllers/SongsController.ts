import escapeRegex from 'escape-regexp';
import { Response } from 'express';
import HttpErrors from 'http-errors';
import joinUrl from 'url-join';
import Database from '../core/infrastructure/database/Database';
import SongCollectionManager from '../core/infrastructure/database/SongCollectionManager';
import UserCollectionManager from '../core/infrastructure/database/UserCollectionManager';
import AuthRequest from '../core/interfaces/AuthRequest';
import CdnServerProvider from '../core/services/CdnServerProvider';
import ConfigProvider from '../core/services/ConfigProvider';
import SongDataValidators from '../core/utils/SongDataValidators';
import SongUtils from '../core/utils/SongUtilts';

class SongsController {
  private readonly _configProvider: ConfigProvider;

  private readonly _songCollectionManager: SongCollectionManager;

  private readonly _userCollectionManager: UserCollectionManager;

  private readonly _cdnServerProvider: CdnServerProvider;

  private readonly _songDataValidators: SongDataValidators;

  private readonly _songUtils: SongUtils;

  constructor(configProvider: ConfigProvider, database: Database) {
    this._configProvider = configProvider;

    this._songCollectionManager = new SongCollectionManager(database.songModelProvider);
    this._userCollectionManager = new UserCollectionManager(database.userModelProvider);

    this._cdnServerProvider = new CdnServerProvider(configProvider);

    this._songDataValidators = new SongDataValidators();

    this._songUtils = new SongUtils(configProvider);
  }

  public upload = async (req: AuthRequest, res: Response) => {
    if (!Buffer.isBuffer(req.body)) {
      throw new HttpErrors.BadRequest('Invalid body provided.');
    }

    const songPath = await this._cdnServerProvider.uploadToCdn(req.body, 'audio/mpeg');
    const id = await this._songCollectionManager.add(req.auth.userId, songPath);

    res.status(201).json({
      message: 'Successfully upload song.',
      result: { id },
    });
  };

  public get = async (req: AuthRequest, res: Response) => {
    const { error, value } = this._songDataValidators.validateQueryParams(req.query);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const result = await this._songCollectionManager.get(value.skip, value.limit);
    res.status(200).json({
      message: 'Successfully retrieved songs.',
      result: result.map((song) =>
        this._songUtils.transformSong(song, req.auth.userId, req.auth.scope),
      ),
    });
  };

  public getById = async (req: AuthRequest, res: Response) => {
    const song = await this._songCollectionManager.getById(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    const { _id: id, path, uploadedBy: uploaderId, likes, ...songData } = song.toObject();

    const url = joinUrl(this._configProvider.cdnServerUri, path);
    const uploadedBy = await this._userCollectionManager.getUsernameById(uploaderId);

    const favorite = this._songUtils.inUserFavorites(req.auth.userId, likes);
    const edit = this._songUtils.canModifiedByUser(req.auth.userId, req.auth.scope, uploaderId);

    res.status(200).json({
      message: 'Successfully retrieved song.',
      result: {
        ...songData,
        id,
        url,
        uploadedBy: uploadedBy ?? 'Deactivated User',
        favorite,
        edit,
      },
    });
  };

  public find = async (req: AuthRequest, res: Response) => {
    const { error, value } = this._songDataValidators.validateQueryParamsWithQs(req.query);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const result = await this._songCollectionManager.find(
      escapeRegex(value.query),
      value.skip,
      value.limit,
    );
    if (result.length === 0) {
      throw new HttpErrors.NotFound('No songs found.');
    }

    res.status(200).json({
      message: 'Successfully retrieved songs.',
      result: result.map((song) =>
        this._songUtils.transformSong(song, req.auth.userId, req.auth.scope),
      ),
    });
  };

  public update = async (req: AuthRequest, res: Response) => {
    const song = await this._songCollectionManager.getById(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    if (!this._songUtils.canModifiedByUser(req.auth.userId, req.auth.scope, song.uploadedBy)) {
      throw new HttpErrors.Forbidden('Access denied.');
    }

    const { error, value } = this._songDataValidators.validateUpdateSongData(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    await this._songCollectionManager.update(req.params.songId, value);

    res.status(200).json({
      message: 'Successfully update song.',
      result: value,
    });
  };

  public updateCover = async (req: AuthRequest, res: Response) => {
    const contentType = req.headers['content-type'];
    if (typeof contentType !== 'string') {
      throw new HttpErrors.UnsupportedMediaType('Unsupported image format.');
    }

    if (!Buffer.isBuffer(req.body)) {
      throw new HttpErrors.BadRequest('Invalid body provided.');
    }

    const song = await this._songCollectionManager.getById(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    const imagePath = await this._cdnServerProvider.uploadToCdn(req.body, contentType);
    const imageUri = joinUrl(this._configProvider.cdnServerUri, imagePath);

    await this._songCollectionManager.update(req.params.songId, { cover: imageUri });

    res.status(200).json({
      message: 'Successfully update song cover.',
      result: {
        cover: imageUri,
      },
    });
  };

  public delete = async (req: AuthRequest, res: Response) => {
    const song = await this._songCollectionManager.getById(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    if (!this._songUtils.canModifiedByUser(req.auth.userId, req.auth.scope, song.uploadedBy)) {
      throw new HttpErrors.Forbidden('Access denied.');
    }

    await this._songCollectionManager.delete(req.params.songId);

    res.status(204).send();
  };

  public getFavorites = async (req: AuthRequest, res: Response) => {
    const { error, value } = this._songDataValidators.validateQueryParams(req.query);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const result = await this._songCollectionManager.getUserFavorites(
      req.auth.userId,
      value.skip,
      value.limit,
    );

    if (result.length === 0) {
      throw new HttpErrors.NotFound('No favorites found.');
    }

    res.status(200).json({
      message: 'Successfully retrieved favorites.',
      result: result.map((song) =>
        this._songUtils.transformSong(song, req.auth.userId, req.auth.scope),
      ),
    });
  };

  public addToFavorites = async (req: AuthRequest, res: Response) => {
    const { error, value } = this._songDataValidators.validateAddToFavoritesData(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const song = await this._songCollectionManager.getById(value.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    const updateQuery = {
      $push: {
        likes: req.auth.userId,
      },
    };

    await this._songCollectionManager.update(value.songId, updateQuery);

    res.status(204).send();
  };

  public deleteFromFavorites = async (req: AuthRequest, res: Response) => {
    const song = await this._songCollectionManager.getById(req.params.songId);
    if (!song) {
      throw new HttpErrors.NotFound('No song found.');
    }

    if (!song.likes.includes(req.auth.userId)) {
      throw new HttpErrors.BadRequest('No favorite found.');
    }

    const updateQuery = {
      $pull: {
        likes: req.auth.userId,
      },
    };

    await this._songCollectionManager.update(req.params.songId, updateQuery);

    res.status(204).send();
  };
}

export default SongsController;
