import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import Joi from '@hapi/joi';
import JWT from 'jsonwebtoken';
import { findByUsernameOrEmail, ExtendedUserInfo } from '../../../api/mongodb/users';
import APIError from '../../../errors/APIError';

const { JWT_SECRET } = process.env;

async function login(user: ExtendedUserInfo, password: string): Promise<string> {
  const compareResult = await Bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw new APIError(401, 'Invalid authorization.');
  }

  return JWT.sign({ uuid: user.uuid }, String(JWT_SECRET), { expiresIn: '1d' });
}

export default () => async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new APIError(400, 'No body provided.');
    }

    const validationSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      throw new APIError(400, `${error.message.replace(/"/g, '`')}.`);
    }

    const { username, password } = value;

    const user = await findByUsernameOrEmail(username);
    if (!user) {
      throw new APIError(403, 'This account has been deactivated.');
    }

    const token = await login(user, password);
    res.status(200).send({ message: 'Successfully logged in.', token });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
