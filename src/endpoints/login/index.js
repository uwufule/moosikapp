import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findByUsername, findByEmail } from '../../apis/mongodb';


const { JWT_SECRET } = process.env;


function login(res, usr, pwd) {
  if (!usr) {
    res.status(403).send({ message: 'This account has been deactivated.' });
    return;
  }

  const pwds = usr.password.hash.split('.');
  const hash = Crypto.createHmac('sha512', pwds[0]).update(pwd).digest('hex');

  const {
    uuid, username, permissions, password: { time },
  } = usr;

  const token = JWT.sign({
    uuid, username, permissions, time,
  }, JWT_SECRET);

  if (pwds[1] === hash) {
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

    if (/^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(username)) {
      try {
        const user = await findByEmail(username);
        login(res, user, password);
      } catch (e) {
        res.status(500).send();
      }
      return;
    }

    try {
      const user = await findByUsername(username);
      login(res, user, password);
    } catch (e) {
      res.status(500).send();
    }
  };
}
