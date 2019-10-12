import { Request, Response } from 'express';
import * as DB from '../../../apis/mongodb/users';

export default () => {
  return async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const user = await DB.getUser(decodeURI(username));

      if (!user) {
        res.status(404).send({ message: 'No user found.' });
        return;
      }

      res.status(200).send({ message: 'Successfully retrieved user.', user });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
