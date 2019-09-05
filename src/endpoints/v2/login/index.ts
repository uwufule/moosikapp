import { Request, Response } from 'express';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { User } from '../../../../typings';
import * as DB from '../../../apis/mongodb/users';

const { JWT_SECRET = '' } = process.env;

function login(res: Response, usr: User | null, pwd: string): void {
  if (!usr) {
    res.status(403).send({ message: 'This account has been deactivated.' });
    return;
  }

  const [salt, passwordHash] = usr.password.hash.split('.');
  const hash = Crypto.createHmac('sha512', salt).update(pwd).digest('hex');

  const {
    uuid, role, password: { timestamp },
  } = usr;

  const token = JWT.sign({
    uuid, role, timestamp,
  }, JWT_SECRET);

  if (passwordHash === hash) {
    res.status(200).send({ message: 'Successfully logged in.', token });
    return;
  }

  res.status(401).send({ message: 'Invalid authorization.' });
}

export default () => {
  return async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      res.status(400).send({ message: 'No body provided.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    try {
      const user = await DB.findUser(username);
      login(res, user, password);
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
