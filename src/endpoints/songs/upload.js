import FS from 'fs';
import Path from 'path';
import Crypto from 'crypto';
import uuidv4 from 'uuid/v4';
import { uploadFileFromStream } from '../../apis/yandex-disk';
import { saveSong } from '../../apis/mongodb/songs';

const TEMP_FILE = 'tmp';

export default function (req, res) {
  const filename = Path.parse(req.headers['x-uploaded-filename'] || '').name;
  const [author, title] = filename.split(' - ').map(s => s.trim());

  const writeStream = FS.createWriteStream(TEMP_FILE, { flags: 'w+', encoding: 'binary' });

  writeStream.end(req.body, async () => {
    const hash = Crypto.createHash('sha256').update(FS.readFileSync(TEMP_FILE)).digest('hex');
    const remotePath = `/${hash}.mp3`;

    const uuid = uuidv4();

    const readStream = FS.createReadStream(TEMP_FILE, { autoClose: true });

    try {
      await uploadFileFromStream(remotePath, readStream);

      await saveSong({
        uuid, author, title, uploadedBy: req.jwt.username, hash,
      });

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
