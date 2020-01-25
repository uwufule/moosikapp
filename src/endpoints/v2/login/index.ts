import { Request, Response } from 'express';
import Crypto from 'crypto';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import JWT from 'jsonwebtoken';
import { findByUsernameOrEmail, PrivateUserInfo } from '../../../api/mongodb/users';
import { insert } from '../../../api/mongodb/tokens';
import APIError from '../../../errors/APIError';

import messages from './messages.json';

interface TokenChain {
  token: string;
  refreshToken: string;
}

const { JWT_SECRET } = process.env;

const validationSchema = Joi.object({
  username: Joi.string()
    .required()
    .error(new Error(messages.login.INVALID_USERNAME)),
  password: Joi.string()
    .required()
    .error(new Error(messages.login.INVALID_PASSWORD)),
});

export function getTokenChain(user: PrivateUserInfo, hex: string): TokenChain {
  const token = JWT.sign({
    uuid: user.uuid,
    role: user.role,
  }, String(JWT_SECRET), { expiresIn: '30m' });

  const refreshToken = JWT.sign({
    userId: user.uuid,
    hex,
  }, String(JWT_SECRET), { expiresIn: '60d' });

  return { token, refreshToken };
}

async function login(user: PrivateUserInfo, password: string): Promise<TokenChain> {
  const comparsionResult = await Bcrypt.compare(password, user.password);
  if (!comparsionResult) {
    throw new APIError(401, messages.login.INVALID_AUTHORIZATION);
  }

  const hex = Crypto.randomBytes(12).toString('hex');
  const tokenChain = getTokenChain(user, hex);

  await insert({ userId: user.uuid, hex });

  return tokenChain;
}

export default () => async (req: Request, res: Response) => {
  try {
    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new APIError(400, error.message);
    }

    const user = await findByUsernameOrEmail(value.username);
    if (!user) {
      throw new APIError(403, messages.login.ACCOUNT_DOESNT_EXISTS);
    }

    const tokenChain = await login(user, value.password);

    res.status(200).send({ message: messages.login.SUCCESS, ...tokenChain });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
