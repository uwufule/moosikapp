import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../../../typings';

export default (minimunRequiredRole: number) => {
  return (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    if (req.jwt.role < minimunRequiredRole) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    next();
  };
}
