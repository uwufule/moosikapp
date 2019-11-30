import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from './authorization';

export default (minimunRequiredRole: number) => (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.jwt.role < minimunRequiredRole) {
    res.status(403).send({ message: 'Forbitten.' });
    return;
  }

  next();
};
