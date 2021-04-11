import { NextFunction, RequestHandler, Response } from 'express';
import HttpErrors from 'http-errors';
import JWT from 'jsonwebtoken';
import AuthRequest from '../core/interfaces/AuthRequest';
import AccessToken from '../core/models/AccessToken';
import ConfigProvider from '../core/services/ConfigProvider';

class AuthMiddleware {
  private readonly _configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;
  }

  public authorize: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Not authorized.');
    }

    const accessToken = this.tryParseAccessToken(authorization.substr(7));
    if (!accessToken) {
      throw new HttpErrors.Forbidden('Invalid authorization.');
    }

    req.auth = {
      userId: accessToken.sub,
      scope: accessToken.scope,
    };

    next();
  };

  private tryParseAccessToken = (accessToken: string) => {
    try {
      return <AccessToken>JWT.verify(accessToken, this._configProvider.jwtSecretKey);
    } catch (e) {
      return null;
    }
  };
}

export default AuthMiddleware;
