import { getDiskInfo } from '../../apis/yandex-disk';


export default function () {
  return async (req, res) => {
    try {
      res.status(200).send(await getDiskInfo());
    } catch (e) {
      res.status(500).send();
    }
  };
}
