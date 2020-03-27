import { Response, RequestHandler } from 'express';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import { revokeRefreshTokens } from '../../../mongodb/refreshTokens';

import messages from './messages.json';

export default (): RequestHandler => async (req: AuthorizedRequest, res: Response) => {
  const isTokensRevoked = await revokeRefreshTokens(req.jwt.uuid);
  if (!isTokensRevoked) {
    throw new HttpErrors.Gone(messages.logout.ALREADY_LOGGED_OUT);
  }

  res.status(200).send({ message: messages.logout.SUCCESS });
};
