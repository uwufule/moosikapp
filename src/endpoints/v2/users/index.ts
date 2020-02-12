import { Request, Response, RequestHandler } from 'express';
import HttpErrors from 'http-errors';
import { getUser } from '../../../api/mongodb/users';

import { NOT_FOUND, SUCCESS } from './messages.json';

export default (): RequestHandler => async (req: Request, res: Response) => {
  const user = await getUser(decodeURI(req.params.username));
  if (!user) {
    throw new HttpErrors.NotFound(NOT_FOUND);
  }

  res.status(200).send({ message: SUCCESS, user });
};
