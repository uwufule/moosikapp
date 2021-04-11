import { NextFunction, RequestHandler, Response } from 'express';
import HttpErrors from 'http-errors';
import AuthRequest from '../core/interfaces/AuthRequest';

class PermissionsMiddleware {
  private readonly _minRequiredRole: number;

  constructor(minRequiredRole: number) {
    this._minRequiredRole = minRequiredRole;
  }

  public check: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.auth.scope < this._minRequiredRole) {
      throw new HttpErrors.Forbidden('Access denied.');
    }

    next();
  };
}

export default PermissionsMiddleware;
