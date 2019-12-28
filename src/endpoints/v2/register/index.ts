import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { createUser } from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

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

export default () => async (req: Request, res: Response) => {
  try {
    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new APIError(400, error.message);
    }

    const salt = await Bcrypt.genSalt();
    const password = await Bcrypt.hash(value.password, salt);

    const uuid = await createUser({ ...value, password });
    res.status(201).send({ message: SUCCESS, uuid });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    if (e instanceof MongoError) {
      switch (e.code) {
        case 11000:
          res.status(400).send({ message: ACCOUNT_ALREADY_EXISTS });
          return;
        default:
      }
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
