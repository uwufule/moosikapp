import { Request, Response, RequestHandler } from 'express';
import { NotFound } from 'http-errors';
import { getByUsername } from '../../../../database/mongo/users';

export default (): RequestHandler => async (req: Request, res: Response) => {
  const user = await getByUsername(decodeURI(req.params.username));
  if (!user) {
    throw new NotFound('No user found.');
  }

  res.status(200).send({ message: 'Successfully retrieved user.', user });
};
