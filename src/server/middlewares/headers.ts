import { RequestHandler, Request, Response, NextFunction } from 'express';
import HttpErrors from 'http-errors';

export const validateAccept = (): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers || req.headers.accept !== 'application/json') {
    throw new HttpErrors.MethodNotAllowed('Incorrect `Accept` header provided.');
  }

  next();
};

export const validateContentType = (...contentTypes: string[]): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { 'content-type': contentType } = req.headers;

  const isMatched = contentTypes.reduce((acc, type) => acc || contentType?.includes(type), false);

  if (!isMatched) {
    throw new HttpErrors.BadRequest('Invalid body provided.');
  }

  next();
};
