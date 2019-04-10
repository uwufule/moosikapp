
export default function auth() {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }
    if (authorization.split(' ')[1] === 'JWT') {
      next();
      return;
    }
    res.status(401).send({ messge: 'Invalid authorization.' });
  };
}
