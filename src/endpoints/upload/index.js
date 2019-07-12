import uuidv4 from 'uuid/v4';
import { Buffer } from 'buffer';

const table = {};

export function upload() {
  return (req, res) => {
    const uuid = uuidv4();

    const { ext = '' } = req.query;
    const dext = Buffer.from(ext, 'utf8').toString('hex');

    res.status(200).send({ url: `https://cdn.moosikapp.tk/v1/upload/${uuid}_${dext}` });

    table[uuid] = setTimeout(() => {
      delete table[uuid];
    }, 600000);
  };
}

export function verify() {
  return (req, res) => {
    const { uuid } = req.query;

    if (table[uuid]) {
      res.status(200).send();

      delete table[uuid];
      clearTimeout(table[uuid]);
      return;
    }

    res.status(404).send();
  };
}
