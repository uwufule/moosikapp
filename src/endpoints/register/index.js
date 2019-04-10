export default function () {
  return (req, res) => {
    if (!req.body) {
      req.status(400).send({ message: 'No body provided.' });
    }

    const { email, username, password } = req.body;
    if (!email) {
      res.status(400).send({ message: 'Invalid e-mail address provided.' });
      return;
    }

    // database actions
    if (false) {
      res.status(400).send({ message: 'An account with that email address and/or username already exists.' });
      return;
    }

    res.status(200).send({ message: 'You have successfully created a new account.' });
  };
}
