import Path from 'path';
import FS from 'fs';
import Crypto from 'crypto';
import Busboy from 'busboy';
import Uuid from 'uuid';
import YandexDiskAPI from '../../apis/yandex-disk';
import { saveSong } from '../../apis/mongodb/songs';


const TEMP_FILE = 'tmp';

const yandexDiskApi = new YandexDiskAPI('AQAAAAAkeVfEAAWUdhFEJeYmG0KpgXAZoZ4tHXg');


function isInvalidMimetype(mimetype) {
  return !['audio/mp3', 'audio/mpeg'].includes(mimetype);
}


export default function (req, res) {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
    if (isInvalidMimetype(mimetype)) {
      file.resume();
      res.status(406).send({ message: 'Unsupported file.' });
      return;
    }

    file.pipe(FS.createWriteStream(TEMP_FILE, { autoClose: true }));

    file.on('end', async () => {
      const parsedFileName = Path.parse(fileName);

      const hash = Crypto.createHash('sha256').update(FS.readFileSync(TEMP_FILE)).digest('hex');

      try {
        const response = await yandexDiskApi.uploadFileFromStream(`${hash}${parsedFileName.ext}`,
          FS.createReadStream(TEMP_FILE, { autoClose: true }));

        const [author, title] = parsedFileName.name.split(/-/);
        await saveSong({
          uuid: Uuid(),
          author: author.trim(),
          title: title.trim(),
          uploadedBy: req.jwt.username,
          hash,
          url: response.url,
        });

        res.status(201).send(response);
      } catch (e) {
        res.status(406).send({ message: 'Error while uploading.' });
      } finally {
        FS.unlinkSync(TEMP_FILE);
      }
    });
  });
  req.pipe(busboy);
}
