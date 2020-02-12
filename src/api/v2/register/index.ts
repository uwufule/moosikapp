import { Request, Response, RequestHandler } from 'express';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import HttpErrors from 'http-errors';
import { createUser } from '../../../mongodb/users';

import {
  INVALID_USERNAME,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  SUCCESS,
  ACCOUNT_ALREADY_EXISTS,
} from './messages.json';

const USERNAME_REGEX = /^([a-z0-9]|[\u30A0-\u30FF]|[\u3040-\u309F])+$/i;
const PASSWORD_REGEX = /^[\w$.!?\-=~#@]+$/i;

const validationSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(2)
    .max(24)
    .regex(USERNAME_REGEX)
    .error(new Error(INVALID_USERNAME)),
  email: Joi.string()
    .required()
    .email({ allowUnicode: false })
    .error(new Error(INVALID_EMAIL)),
  password: Joi.string()
    .required()
    .min(8)
    .regex(PASSWORD_REGEX)
    .error(new Error(INVALID_PASSWORD)),
});

export default (): RequestHandler => async (req: Request, res: Response) => {
  const { error, value } = validationSchema.validate(req.body);
  if (error) {
    throw new HttpErrors.BadRequest(error.message);
  }

  const salt = await Bcrypt.genSalt();
  const password = await Bcrypt.hash(value.password, salt);

  let uuid;
  try {
    uuid = await createUser({ ...value, password });
  } catch (e) {
    throw new HttpErrors.BadRequest(ACCOUNT_ALREADY_EXISTS);
  }

  res.status(201).send({ message: SUCCESS, uuid });
};
