import JWT from 'jsonwebtoken';

const JWT_SECRET = 'bca16e36812f55eb2894c082652cae7b';


export default function () {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    try {
      req.jwt = JWT.verify(authorization.split(' ')[1], JWT_SECRET);
      next();
    } catch (e) {
      res.status(403).send({ message: 'Not authorized.' });
    }
  };
}
