const API_VERSION = 1;

export function validateAccept() {
  return (req, res, next) => {
    if (!req.headers || req.headers.accept !== `application/vnd.moosik.${API_VERSION}+json`) {
      res.status(405).send({ message: 'Incorrect `Accept` header provided.' });
      return;
    }
    next();
  };
}

export function validateContentType() {
  return (req, res, next) => {
    if (!req.headers || req.headers['content-type'] !== 'application/json') {
      res.status(400).send({ message: 'Invalid body provided.' });
      return;
    }
    next();
  };
}
