import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpError } from 'http-errors';

class AsyncErrorHandler {
  public getHandler = () => {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
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
  };

  public static with = (...handlers: RequestHandler[]) => {
    return handlers.map(AsyncErrorHandler.handleAsyncError);
  };

  private static handleAsyncError = (handler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (e) {
        next(e);
      }
    };
  };
}
export default AsyncErrorHandler;
