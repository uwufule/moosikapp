import { Request, Response, NextFunction } from 'express';
import JWT, { JsonWebTokenError } from 'jsonwebtoken';
import { getUserByUuid } from '../apis/mongodb/users';
import APIError from '../errors/APIError';

const { JWT_SECRET = '' } = process.env;

interface JWTRecord {
  uuid: string;
  role: number;
  timestamp: string;
}

export interface AuthorizedRequest extends Request {
  jwt: JWTRecord;
}

export default () => async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new APIError(401, 'Invalid authorization.'));
    return;
  }

  const token = authorization.slice(7);

  try {
    req.jwt = JWT.verify(token, JWT_SECRET) as JWTRecord;

    const user = await getUserByUuid(req.jwt.uuid);
    if (!user) {
      throw new APIError(401, 'Invalid authorization.');
    }

    const { timestamp } = user.password;

    if (new Date(req.jwt.timestamp).getTime() !== timestamp.getTime()) {
      throw new APIError(403, 'Not authorized.');
    }

    next();
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      next(new APIError(403, 'Not authorized.'));
      return;
    }

    next(e);
  }
};
