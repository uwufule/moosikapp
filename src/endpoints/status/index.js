import { getDiskStatus } from '../../apis/yandex-disk';

export default function () {
  return async (req, res) => {
    try {
      res.status(200).send(await getDiskStatus());
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
