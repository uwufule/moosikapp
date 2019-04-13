import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { findByUsername, findByEmail } from '../../apis/mongodb';


const JWT_SECRET = 'bca16e36812f55eb2894c082652cae7b.799ef9efbd00ae81a34172bfdd6471f7e79f7f2a5574819f77598daa0c5b6a1e6f2c2f8de8f3124a9ba6c9ab738d00a36bb4a0e575d4c9ac7cd75d2145b006f0';


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
