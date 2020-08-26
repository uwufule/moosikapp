import { RequestHandler, Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import { AccessToken } from '../utils/tokens';

const JWT_SECRET = String(process.env.JWT_SECRET);

interface AuthData {
  userId: string;
  userRole: number;
}

export interface AuthRequest extends Request {
  auth: AuthData;
}

export default (): RequestHandler => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new HttpErrors.Unauthorized('Not authorized.');
  }

  const accessToken = authorization.slice(7);
  try {
    const { sub, scope } = <AccessToken>JWT.verify(accessToken, JWT_SECRET);
    req.auth = {
      userId: sub,
      userRole: scope,
    };
  } catch {
    throw new HttpErrors.Forbidden('Invalid authorization.');
  }

  next();
};
