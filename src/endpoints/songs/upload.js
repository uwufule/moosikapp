import Path from 'path';
import Busboy from 'busboy';

export default function upload(yandexDiskApi) {
  return (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (!['audio/mp3', 'audio/mpeg'].includes(mimetype)) {
        file.resume();
        res.status(406).send({ error: 'UnsupportedFile' });
        return;
      }

      yandexDiskApi.uploadFileFromStream(Path.basename(filename), file)
        .then((data) => {
          res.status(201).send(data);
        })
        .catch(() => {
          file.resume();
          res.status(406).send({ error: 'UploadError' });
        });
    });
    req.pipe(busboy);
  };
}
