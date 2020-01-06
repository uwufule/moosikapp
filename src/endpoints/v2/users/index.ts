import { Request, Response } from 'express';
import { getUser } from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

import { NOT_FOUND, SUCCESS } from './messages.json';

export default () => async (req: Request, res: Response) => {
  try {
    const user = await getUser(decodeURI(req.params.username));
    if (!user) {
      throw new APIError(404, NOT_FOUND);
    }

    res.status(200).send({ message: SUCCESS, user });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
