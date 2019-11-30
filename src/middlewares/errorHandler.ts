import { Request, Response, NextFunction } from 'express';
import APIError from '../errors/APIError';

export default () => (error: any, req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof APIError) {
    res.status(error.statusCode).send({ message: error.message });
    return;
  }

  switch (error.type) {
    case 'entity.too.large':
      res.status(413).send({ message: 'Request body too large.' });
      break;
    default:
      res.status(500).send({ message: 'Internal server error.' });
  }
};
