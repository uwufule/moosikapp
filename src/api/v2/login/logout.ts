import { Response, RequestHandler } from 'express';
import HttpErrors from 'http-errors';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import { revokeTokens } from '../../../mongodb/tokens';

import messages from './messages.json';

export default (): RequestHandler => async (req: AuthorizedRequest, res: Response) => {
  const n = await revokeTokens(req.jwt.uuid);
  if (n === 0) {
    throw new HttpErrors.Gone(messages.logout.ALREADY_LOGGED_OUT);
  }

  res.status(200).send({ message: messages.logout.SUCCESS });
};
