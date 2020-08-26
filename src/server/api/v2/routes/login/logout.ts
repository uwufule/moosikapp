import { Response, RequestHandler } from 'express';
import { Gone } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import { revokeRefreshTokensForUser } from '../../../../database/mongo/refreshTokens';

export default (): RequestHandler => async (req: AuthRequest, res: Response) => {
  if (!(await revokeRefreshTokensForUser(req.auth.userId))) {
    throw new Gone('Already logged out.');
  }

  res.status(200).send({ message: 'Successfully logged out.' });
};
