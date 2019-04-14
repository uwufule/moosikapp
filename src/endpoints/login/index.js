import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findByUsername, findByEmail } from '../../apis/mongodb';


const JWT_SECRET = 'bca16e36812f55eb2894c082652cae7b';


function login(res, user, password) {
  if (!user) {
    res.status(403).send({ message: 'This account has been deactivated.' });
    return;
  }

  const passwords = user.password.split('.');
  const hash = Crypto.createHmac('sha512', passwords[0]).update(password).digest('hex');

  const token = JWT.sign({
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    permissionLevel: user.permissionLevel,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }, JWT_SECRET);

  if (passwords[1] === hash) {
    res.status(200).send({
      message: 'Successfully logged in.',
      token,
    });
    return;
  }
  res.status(401).send({ message: 'Invalid authorization.' });
}

export default function () {
  return (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: 'No body provided.' });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    if (/^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(username)) {
      findByEmail(username)
        .then((user) => {
          login(res, user, password);
        })
        .catch(() => {
          res.status(500).send();
        });
      return;
    }

    findByUsername(username)
      .then((user) => {
        login(res, user, password);
      })
      .catch(() => {
        res.status(500).send();
      });
  };
}
