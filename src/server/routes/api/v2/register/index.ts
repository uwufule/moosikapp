import { Request, Response, RequestHandler } from 'express';
import Bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { BadRequest } from 'http-errors';
import { createUser } from '../../../../mongodb/users';

const registerSceme = Joi.object({
  username: Joi.string()
    .required()
    .min(1)
    .max(64)
    .regex(/^\w+$/u)
    .error(new Error(
      'Invalid username provided. Username must contain 1-64 letters or numbers.',
    )),
  email: Joi.string()
    .required()
    .email({ allowUnicode: false })
    .error(new Error(
      'Invalid e-mail address provided.',
    )),
  password: Joi.string()
    .required()
    .min(8)
    .error(new Error(
      'Invalid password provided. Username must be at least 8 symbols long.',
    )),
});

export default (): RequestHandler => (
  async (req: Request, res: Response) => {
    const { error, value } = registerSceme.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const registerData = <{
      username: string, email: string, password: string,
    }>value;

    const password = await Bcrypt.hash(registerData.password, 16);

    try {
      const uuid = await createUser({ ...registerData, password });
      res.status(201).send({ message: 'You have successfully created a new account.', uuid });
    } catch {
      throw new BadRequest(
        'An account with that email address and/or username already exists.',
      );
    }
  }
);
