import { getUser } from '../../apis/mongodb/users';


export default function () {
  return async (req, res) => {
    try {
      const user = await getUser(req.params.username);
      if (!user) {
        res.status(404).send({ message: 'No user found.' });
        return;
      }
      res.status(200).send({ message: 'Successfully retrieved user.', user });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
