import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import Crypto from 'crypto';
import { createUser } from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

const EMAIL_REGEX = /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;

export default () => async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new APIError(400, 'No body provided.');
    }

    const { username, email, password } = req.body;

    if (typeof username !== 'string' || /\s/.test(username)) {
      throw new APIError(400, 'Username must not contain spaces.');
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      throw new APIError(400, 'Invalid e-mail address provided.');
    }

    if (typeof password !== 'string' || /\s/.test(password)) {
      throw new APIError(400, 'Password must not contain spaces.');
    }

    const salt = Crypto.randomBytes(16).toString('hex');
    const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

    const uuid = await createUser({
      username,
      email,
      password: `${salt}.${hash}`,
    });

    res.status(201).send({ message: 'You have successfully created a new account.', uuid });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    if (e instanceof MongoError) {
      switch (e.code) {
        case 11000:
          res.status(400).send({
            message: 'An account with that email address and/or username already exists.',
          });
          return;
        default:
      }
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
