import JWT from 'jsonwebtoken';

const JWT_SECRET = 'bca16e36812f55eb2894c082652cae7b.799ef9efbd00ae81a34172bfdd6471f7e79f7f2a5574819f77598daa0c5b6a1e6f2c2f8de8f3124a9ba6c9ab738d00a36bb4a0e575d4c9ac7cd75d2145b006f0';


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
