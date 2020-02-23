import {
  RequestHandler, Request, Response, NextFunction,
} from 'express';
import HttpErrors from 'http-errors';
import JWT from 'jsonwebtoken';
import { getUserByUuid } from '../mongodb/users';

const { JWT_SECRET } = process.env;

interface AccessToken {
  uuid: string;
  role: number;
}

export interface AuthorizedRequest extends Request {
  jwt: AccessToken;
}

export default (): RequestHandler => (
  async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Invalid authorization.');
    }

    const token = authorization.slice(7);

    try {
      req.jwt = <AccessToken>JWT.verify(token, String(JWT_SECRET));
    } catch (e) {
      throw new HttpErrors.Forbidden('Not authorized.');
    }

    const user = await getUserByUuid(req.jwt.uuid);
    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid authorization.');
    }

    next();
  }
);
