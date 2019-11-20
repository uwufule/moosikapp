import { Request, Response } from 'express';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findUser, ExtendedUserInfo } from '../../../apis/mongodb/users';

const { JWT_SECRET = '' } = process.env;

function login(res: Response, user: ExtendedUserInfo, password: string): void {
  const [salt, passwordHash] = user.password.hash.split('.');
  const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

  if (passwordHash !== hash) {
    res.status(401).send({ message: 'Invalid authorization.' });
    return;
  }

  const { uuid, role, password: { timestamp } } = user;

  const token = JWT.sign({ uuid, role, timestamp }, JWT_SECRET);

  res.status(200).send({ message: 'Successfully logged in.', token });
}

export default () => async (req: Request, res: Response): Promise<void> => {
  if (!req.body) {
    res.status(400).send({ message: 'No body provided.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).send({ message: 'Invalid authorization.' });
    return;
  }

  try {
    const user = await findUser(username);
    if (!user) {
      res.status(403).send({ message: 'This account has been deactivated.' });
      return;
    }

    login(res, user, password);
  } catch (e) {
    res.status(500).send({ message: 'Internal server error.' });
  }
};
