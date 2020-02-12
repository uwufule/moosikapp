import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import HttpErrors from 'http-errors';

export const validateAccept = (): RequestHandler => (
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers || req.headers.accept !== 'application/json') {
      throw new HttpErrors.MethodNotAllowed('Incorrect `Accept` header provided.');
    }

    next();
  }
);

export const validateContentType = (...contentType: string[]): RequestHandler => (
  (req: Request, res: Response, next: NextFunction): void => {
    const { 'content-type': reqContentType } = req.headers;

    const isMatched = contentType.reduce(
      (acc, type) => acc || reqContentType?.includes(type),
      false,
    );

    if (!isMatched) {
      throw new HttpErrors.BadRequest('Invalid body provided.');
    }

    next();
  }
);
