import { Request, Response, NextFunction } from 'express';

export function validateAccept() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.headers || req.headers.accept !== 'application/json') {
      res.status(405).send({ message: 'Incorrect `Accept` header provided.' });
      return;
    }
    next();
  };
}

export function validateContentType(contentType: string | Array<string>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { 'content-type': requestContentType } = req.headers;

    const isMatched = typeof contentType === 'string'
      ? contentType === requestContentType
      : contentType.reduce(
        (accumulator, type) => accumulator || requestContentType?.includes(type),
        false,
      );

    if (!isMatched) {
      res.status(400).send({ message: 'Invalid body provided.' });
      return;
    }

    next();
  };
}
