import JWT from 'jsonwebtoken';
import { findByUsername } from '../../apis/mongodb';

const { JWT_SECRET } = process.env;


export default function () {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    const token = authorization.split(' ')[1];

    try {
      req.jwt = JWT.verify(token, JWT_SECRET);

      const { password: { time } } = await findByUsername(req.jwt.username);
      if (new Date(req.jwt.time).valueOf() !== time.valueOf()) {
        throw new Error('NotAuthorizedError');
      }

      next();
    } catch (e) {
      res.status(403).send({ message: 'Not authorized.' });
    }
  };
}
