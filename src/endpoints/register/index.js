import Crypto from 'crypto';
import uuidv4 from 'uuid/v4';
import { createUser } from '../../apis/mongodb/users';

const EMAIL_REGEX = /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;

export default function () {
  return async (req, res) => {
    if (!req.body) {
      req.status(400).send({ message: 'No body provided.' });
    }

    const { email, username, password } = req.body;
    if (!email || !EMAIL_REGEX.test(email)) {
      res.status(400).send({ message: 'Invalid e-mail address provided.' });
      return;
    }

    const salt = Crypto.randomBytes(16).toString('hex');
    const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

    const uuid = uuidv4();

    try {
      await createUser({
        uuid, username, email, password: { hash: `${salt}.${hash}` },
      });

      res.status(200).send({ message: 'You have successfully created new account.', uuid });
    } catch (e) {
      if (e.errmsg.startsWith('E11000')) {
        res.status(400).send({ message: 'An account with that email address and/or username already exists.' });
        return;
      }
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
