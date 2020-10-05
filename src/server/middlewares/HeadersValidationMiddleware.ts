import { RequestHandler, Request, Response, NextFunction } from 'express';
import HttpErrors from 'http-errors';

class HeadersValidationMiddleware {
  private static readonly VALID_ACCEPT_HEADER = 'application/json';

  public static validateAccept: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.headers.accept !== HeadersValidationMiddleware.VALID_ACCEPT_HEADER) {
      throw new HttpErrors.MethodNotAllowed('Incorrect `Accept` header provided.');
    }

    next();
  };

  public static validateContentType = (...contentTypes: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      const contentType = req.headers['content-type'];

      const includesRequiredContentType = contentTypes.reduce((acc, val) => {
        return acc || contentType?.startsWith(val);
      }, false);

      if (!includesRequiredContentType) {
        throw new HttpErrors.BadRequest('Invalid body provided.');
      }

      next();
    };
  };
}

export default HeadersValidationMiddleware;
