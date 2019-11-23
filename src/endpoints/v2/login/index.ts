import { Request, Response } from 'express';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findUser, ExtendedUserInfo } from '../../../apis/mongodb/users';
import APIError from '../../../errors/APIError';

const { JWT_SECRET = '' } = process.env;

function login(user: ExtendedUserInfo, password: string): string {
  const [salt, passwordHash] = user.password.hash.split('.');
  const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

  if (passwordHash !== hash) {
    throw new APIError(401, 'Invalid authorization.');
  }

  const {
    uuid,
    role,
    password: { timestamp },
  } = user;

  return JWT.sign({ uuid, role, timestamp }, JWT_SECRET);
}

export default () => async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new APIError(400, 'No body provided.');
    }

    const { username, password } = req.body;
    if (!username || !password) {
      throw new APIError(401, 'Invalid authorization.');
    }

    const user = await findUser(username);
    if (!user) {
      throw new APIError(403, 'This account has been deactivated.');
    }

    const token = login(user, password);
    res.status(200).send({ message: 'Successfully logged in.', token });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
