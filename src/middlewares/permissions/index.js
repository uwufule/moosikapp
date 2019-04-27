export default function (minimumPermissionLevel) {
  return (req, res, next) => {
    if (req.jwt.permissions < minimumPermissionLevel) {
      res.status(403).send({ message: 'Forbitten.' });
      return;
    }

    next();
  };
}
