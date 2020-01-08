import { Response } from 'express';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as TokenManager from '../../../api/mongodb/tokens';
import APIError from '../../../errors/APIError';

import messages from './messages.json';

export default () => async (req: AuthorizedRequest, res: Response) => {
  try {
    const n = await TokenManager.clear(req.jwt.uuid);
    if (n === 0) {
      throw new APIError(410, messages.logout.ALREADY_LOGGED_OUT);
    }

    res.status(200).send({ message: messages.logout.SUCCESS });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
