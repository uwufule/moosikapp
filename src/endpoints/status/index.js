import { getDiskStatus } from '../../apis/yandex-disk';

export default function () {
  return async (req, res) => {
    try {
      const disk = await getDiskStatus();
      res.status(200).send({ message: 'Successfully retrieved status.', disk });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
