export default function (minimunRequiredRole) {
  return (req, res, next) => {
    if (req.jwt.role < minimunRequiredRole) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    next();
  };
}
