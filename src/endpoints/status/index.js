export default function () {
  return async (req, res) => {
    try {
      res.status(200).send({ message: 'Not implemented.' });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
