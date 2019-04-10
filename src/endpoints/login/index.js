export default function () {
  return (req, res) => {
    if (!req.body) {
      req.status(400).send({ message: 'No body provided.' });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).send({ message: 'Invalid authorization.' });
      return;
    }

    // database actions

    res.status(200).send({
      message: 'Successfully logged in.',
      token: 'JWT',
    });
  };
}
