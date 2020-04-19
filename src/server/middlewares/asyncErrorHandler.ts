import {
  RequestHandler, Request, Response, NextFunction,
} from 'express';
import { HttpError } from 'http-errors';

export const withAsyncErrorHandler = (...handlers: RequestHandler[]) => (
  handlers.map((handler) => (
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (e) {
        next(e);
      }
    }
  ))
);

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof HttpError) {
    const message = (
      error.name === 'PayloadTooLargeError' ? 'Request entity too large.' : error.message
    );

    res.status(error.status).send({ message });
    return;
  }

  res.status(500).send({ message: 'Internal server error.' });
};
