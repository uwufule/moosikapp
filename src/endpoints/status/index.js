import { getDiskStatus } from '../../apis/yandex-disk';

export default function () {
  return async (req, res) => {
    try {
      const storage = await getDiskStatus();
      res.status(200).send({ message: 'Successful retrieving status.', storage });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
