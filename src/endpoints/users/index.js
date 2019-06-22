import { getUser } from '../../apis/mongodb/users';

export default function () {
  return async (req, res) => {
    const { username } = req.params;

    try {
      const user = await getUser(decodeURI(username));

      if (!user) {
        res.status(404).send({ message: 'No user found.' });
        return;
      }

      res.status(200).send({ message: 'Successfully retrieved user.', user });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
