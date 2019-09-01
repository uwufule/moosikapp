import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findUser } from '../../../apis/mongodb/users';

const { JWT_SECRET } = process.env;

function login(res, usr, pwd) {
  if (!usr) {
    res.status(403).send({ message: 'This account has been deactivated.' });
    return;
  }

  const [salt, passwordHash] = usr.password.hash.split('.');
  const hash = Crypto.createHmac('sha512', salt).update(pwd).digest('hex');

  const {
    uuid, role, password: { timestamp },
  } = usr;

  const token = JWT.sign({
    uuid, role, timestamp,
  }, JWT_SECRET);

  if (passwordHash === hash) {
    res.status(200).send({ message: 'Successfully logged in.', token });
    return;
  }

  res.status(401).send({ message: 'Invalid authorization.' });
}

export default function () {
  return async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: 'No body provided.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    try {
      const user = await findUser(username);
      login(res, user, password);
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
