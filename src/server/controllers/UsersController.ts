import escapeRegex from 'escape-regexp';
import Bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import HttpErrors from 'http-errors';
import TokenCollectionManager from '../core/infrastructure/database/TokenCollectionManager';
import UserCollectionManager from '../core/infrastructure/database/UserCollectionManager';
import AuthRequest from '../core/interfaces/AuthRequest';
import ConfigProvider from '../core/services/ConfigProvider';
import TokenManager from '../core/services/TokenManager';
import RefreshTokenUtils from '../core/utils/RefreshTokenUtils';
import UserDataValidators from '../core/utils/UserDataValidators';

class UsersController {
  private readonly _userCollectionManager: UserCollectionManager;

  private readonly _tokenCollectionManager: TokenCollectionManager;

  private readonly _tokenManager: TokenManager;

  private readonly _userDataValidators: UserDataValidators;

  private readonly _refreshTokenUtils: RefreshTokenUtils;

  constructor(configProvider: ConfigProvider, userCollectionManager: UserCollectionManager) {
    this._userCollectionManager = userCollectionManager;

    this._tokenCollectionManager = new TokenCollectionManager();
    this._tokenManager = new TokenManager(configProvider, this._tokenCollectionManager);

    this._userDataValidators = new UserDataValidators();

    this._refreshTokenUtils = new RefreshTokenUtils(configProvider);
  }

  public signup = async (req: Request, res: Response) => {
    const { error, value } = this._userDataValidators.validateSignupData(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const password = await Bcrypt.hash(value.password, 10);

    try {
      const id = await this._userCollectionManager.add({ ...value, password });
      res.status(201).json({
        message: 'You have successfully created a new account.',
        result: { id },
      });
    } catch (e) {
      throw new HttpErrors.BadRequest(
        'An account with that email address and/or username already exists.',
      );
    }
  };

  public login = async (req: Request, res: Response) => {
    const { error, value } = this._userDataValidators.validateLoginData(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const user = await this._userCollectionManager.findByUsernameOrEmail(value.username);
    if (!user) {
      throw new HttpErrors.NotFound('This account has been deactivated.');
    }

    if (!(await Bcrypt.compare(value.password, user.password))) {
      throw new HttpErrors.Unauthorized('Invalid authorization.');
    }

    const token = await this._tokenManager.createToken(user.id, Number(user.role));

    res.status(200).json({
      message: 'Successfully logged in.',
      result: token,
    });
  };

  public refresh = async (req: Request, res: Response) => {
    const { error, value } = this._userDataValidators.validateRefreshData(req.body);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const refreshToken = this._refreshTokenUtils.tryParse(value.refreshToken);
    if (!refreshToken) {
      throw new HttpErrors.BadRequest('Invalid refresh token.');
    }

    if (!(await this._tokenCollectionManager.has(refreshToken.jti))) {
      throw new HttpErrors.BadRequest('Invalid refresh token.');
    }

    const user = await this._userCollectionManager.getById(refreshToken.sub);
    if (!user) {
      throw new HttpErrors.BadRequest('Trying to get token for deactivated user.');
    }

    const token = await this._tokenManager.updateToken(
      user.id,
      Number(user.role),
      refreshToken.jti,
    );

    res.status(200).json({
      message: 'Successfully refreshed token.',
      result: token,
    });
  };

  public logout = async (req: AuthRequest, res: Response) => {
    if (!(await this._tokenCollectionManager.deleteForUser(req.auth.userId))) {
      throw new HttpErrors.Gone('Already logged out.');
    }

    res.status(200).json({
      message: 'Successfully logged out.',
    });
  };

  public get = async (req: Request, res: Response) => {
    const result = await this._userCollectionManager.get();

    res.status(200).json({
      message: 'Successfully retrieved users.',
      result: result.map(({ _id: id, ...userData }) => ({ ...userData, id })),
    });
  };

  public getById = async (req: Request, res: Response) => {
    const result = await this._userCollectionManager.getById(req.params.userId);
    if (!result) {
      throw new HttpErrors.NotFound('No user found.');
    }

    const { _id: id, ...userData } = result.toObject();

    res.status(200).json({
      message: 'Successfully retrieved user.',
      result: { ...userData, id },
    });
  };

  public findByUsername = async (req: Request, res: Response) => {
    const { error, value } = this._userDataValidators.validateFindUserByUsername(req.query);
    if (error) {
      throw new HttpErrors.BadRequest(error.message);
    }

    const result = await this._userCollectionManager.findByUsername(escapeRegex(value.username));
    if (!result) {
      throw new HttpErrors.NotFound('No user found.');
    }

    const { _id: id, ...userData } = result.toObject();

    res.status(200).json({
      message: 'Successfully retrieved user.',
      result: { ...userData, id },
    });
  };

  public update = () => {
    throw new HttpErrors.NotImplemented();
  };

  public delete = async (req: AuthRequest, res: Response) => {
    if (!(await this._userCollectionManager.delete(req.auth.userId))) {
      throw new HttpErrors.InternalServerError('Something went wrong.');
    }

    res.status(204).send();
  };
}

export default UsersController;
