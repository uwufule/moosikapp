import { Request, Response } from 'express';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import JWT from 'jsonwebtoken';
import { findByUsernameOrEmail, ExtendedUserInfo } from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

import {
  INVALID_AUTHORIZATION,
  INVALID_USERNAME,
  INVALID_PASSWORD,
  ACCOUNT_DOESNT_EXISTS,
  SUCCESS,
} from './messages.json';

const { JWT_SECRET } = process.env;

async function login(user: ExtendedUserInfo, password: string): Promise<string> {
  const comparsionResult = await Bcrypt.compare(password, user.password);
  if (!comparsionResult) {
    throw new APIError(401, INVALID_AUTHORIZATION);
  }

  return JWT.sign({ uuid: user.uuid }, String(JWT_SECRET), { expiresIn: '1d' });
}

export default () => async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new APIError(400, 'No body provided.');
    }

    const validationSchema = Joi.object({
      username: Joi.string()
        .required()
        .error(new Error(INVALID_USERNAME)),
      password: Joi.string()
        .required()
        .error(new Error(INVALID_PASSWORD)),
    });

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new APIError(400, error.message);
    }

    const user = await findByUsernameOrEmail(value.username);
    if (!user) {
      throw new APIError(403, ACCOUNT_DOESNT_EXISTS);
    }

    const token = await login(user, value.password);
    res.status(200).send({ message: SUCCESS, token });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
