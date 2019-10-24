import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../authorization';

export default (minimunRequiredRole: number) => {
  return (req: AuthorizedRequest, res: Response, next: NextFunction): void => {
    if (req.jwt.role < minimunRequiredRole) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    next();
  };
}
