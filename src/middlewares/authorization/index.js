import JWT from 'jsonwebtoken';
import { getUserByUuid } from '../../apis/mongodb/users';

const { JWT_SECRET } = process.env;

export default function () {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    const token = authorization.slice(7);

    try {
      req.jwt = JWT.verify(token, JWT_SECRET);

      const { password: { timestamp } } = await getUserByUuid(req.jwt.uuid);

      if (new Date(req.jwt.timestamp).getTime() !== timestamp.getTime()) {
        throw new Error('NotAuthorizedError');
      }

      next();
    } catch (e) {
      res.status(403).send({ message: 'Not authorized.' });
    }
  };
}
