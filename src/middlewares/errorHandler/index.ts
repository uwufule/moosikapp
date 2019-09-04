import { Request, Response, NextFunction } from 'express';
import { HTTPException } from '../../../typings';

export default () => {
  return (error: HTTPException, req: Request, res: Response, next: NextFunction) => {
    if (!error) {
      next();
    }

    switch (error.type) {
      case 'entity.too.large':
        res.status(413).send({ message: 'Request body too large.' });
        break;
      default:
        res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
