import Crypto from 'crypto';
import { Request, Response, RequestHandler } from 'express';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import HttpErrors from 'http-errors';
import { findByUsernameOrEmail, PrivateUserData } from '../../../mongodb/users';
import { addToken } from '../../../mongodb/tokens';
import createTokenChain, { TokenChain } from '../../../utils/tokenChain';

import messages from './messages.json';

const validationSchema = Joi.object({
  username: Joi.string()
    .required()
    .error(new Error(messages.login.INVALID_USERNAME)),
  password: Joi.string()
    .required()
    .error(new Error(messages.login.INVALID_PASSWORD)),
});

const login = async (user: PrivateUserData, password: string): Promise<TokenChain> => {
  const comparsionResult = await Bcrypt.compare(password, user.password);
  if (!comparsionResult) {
    throw new HttpErrors.Unauthorized(messages.login.INVALID_AUTHORIZATION);
  }

  const hex = Crypto.randomBytes(12).toString('hex');
  const tokenChain = createTokenChain(user, hex);

  await addToken({ userId: user.uuid, hex });

  return tokenChain;
};

export default (): RequestHandler => async (req: Request, res: Response) => {
  const { error, value } = validationSchema.validate(req.body);
  if (error) {
    throw new HttpErrors.BadRequest(error.message);
  }

  const user = await findByUsernameOrEmail(value.username);
  if (!user) {
    throw new HttpErrors.Forbidden(messages.login.ACCOUNT_DOESNT_EXISTS);
  }

  const tokenChain = await login(user, value.password);

  res.status(200).send({ message: messages.login.SUCCESS, ...tokenChain });
};
