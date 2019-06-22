import FS from 'fs';
import Crypto from 'crypto';
import uuidv4 from 'uuid/v4';
import { uploadFileFromStream } from '../../apis/yandex-disk';
import { saveSong } from '../../apis/mongodb/songs';

const TEMP_FILE = 'tmp';

export default function (req, res) {
  const writeStream = FS.createWriteStream(TEMP_FILE, { flags: 'w+', encoding: 'binary' });

  writeStream.end(req.body, async () => {
    const hash = Crypto.createHash('sha256').update(FS.readFileSync(TEMP_FILE)).digest('hex');

    const url = `/${hash}.mp3`;

    const uuid = uuidv4();

    const readStream = FS.createReadStream(TEMP_FILE, { autoClose: true });

    try {
      await uploadFileFromStream(url, readStream);

      await saveSong({ uuid, uploadedBy: req.jwt.username, url });

      res.status(201).send({ message: 'You have successfully uploaded a new song.', uuid });
    } catch (e) {
      switch (e.toString()) {
        case 'Error: DiskResourceAlreadyExistsError':
          res.status(406).send({ message: 'Already exists.' });
          break;
        default:
          res.status(406).send({ message: 'Error while uploading.' });
      }
    } finally {
      readStream.resume();
      FS.unlinkSync(TEMP_FILE);
    }
  });
}
