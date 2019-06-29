export default function () {
  return (error, req, res, next) => {
    if (!error) {
      next();
    }

    switch (error.type) {
      case 'entity.too.large':
        res.status(413).send({ message: 'Request body too large.' });
        break;
      default:
        res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
