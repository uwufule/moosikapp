import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

export const withAsyncErrorHandler = (...handlers: RequestHandler[]) =>
  handlers.map((handler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  });

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    next();
    return;
  }

  if (error.name === 'PayloadTooLargeError') {
    res.status(413).send({ message: 'Request entity too large.' });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).send({ message: error.message });
    return;
  }

  res.status(500).send({ message: 'Internal server error.' });
};
