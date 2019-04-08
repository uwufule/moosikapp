
export default function auth() {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('OAuth')) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    if (authorization.split(' ')[1] === 'token') {
      next();
      return;
    }
    res.status(401).send({ error: 'Unauthorized' });
  };
}
