import FS from 'fs';
import Crypto from 'crypto';
import Uuid from 'uuid';
import { uploadFileFromStream } from '../../apis/yandex-disk';
import { saveSong } from '../../apis/mongodb/songs';


const TEMP_FILE = 'tmp';


export default function (req, res) {
  if (req.headers['content-type'] !== 'audio/mpeg') {
    res.send({ message: 'No data provided.' });
    return;
  }

  const filename = req.headers['x-uploaded-filename'] || '';
  const [author, title] = filename.replace('.mp3', '').split('-').map(a => a.trim());

  const writeStream = FS.createWriteStream(TEMP_FILE, { flags: 'w+', encoding: 'binary' });

  writeStream.end(req.body, async () => {
    const hash = Crypto.createHash('sha256').update(FS.readFileSync(TEMP_FILE)).digest('hex');
    const remotePath = `/${hash}.mp3`;

    const uuid = Uuid();

    const readStream = FS.createReadStream(TEMP_FILE, { autoClose: true });

    try {
      await uploadFileFromStream(remotePath, readStream);

      await saveSong({
        uuid, author, title, uploadedBy: req.jwt.username, hash,
      });

      res.status(201).send({ message: 'You have successfully uploaded a new song.', uuid });
    } catch (e) {
      res.status(406).send({ message: 'Error while uploading.' });
    } finally {
      readStream.resume();
      FS.unlinkSync(TEMP_FILE);
    }
  });
}
