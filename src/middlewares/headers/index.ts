import { Request, Response, NextFunction } from 'express';

export function validateAccept() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers || req.headers.accept !== 'application/json') {
      res.status(405).send({ message: 'Incorrect `Accept` header provided.' });
      return;
    }
    next();
  };
}

export function validateContentType(contentType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers || req.headers['content-type'] !== contentType) {
      res.status(400).send({ message: 'Invalid body provided.' });
      return;
    }
    next();
  };
}
