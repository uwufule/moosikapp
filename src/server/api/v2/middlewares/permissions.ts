import { RequestHandler, Response, NextFunction } from 'express';
import HttpErrors from 'http-errors';
import { AuthRequest } from './authorization';

export default (minRequiredRole: number): RequestHandler => (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.auth.userRole < minRequiredRole) {
    throw new HttpErrors.Forbidden('Access denied.');
  }

  next();
};
