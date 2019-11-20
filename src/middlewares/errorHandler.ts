import { Request, Response, NextFunction } from 'express';

interface HTTPException extends Error {
  type: string;
}

export default () => (error: HTTPException, req: Request, res: Response, next: NextFunction) => {
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
