import Path from 'path';
import Express from 'express';
import Busboy from 'busboy';
import YandexDiskAPI from './api/yandex-disk';
import Auth from './middleware/auth';
import DB from './api/mongodb';

const app = Express();
const yandexDiskApi = new YandexDiskAPI('AQAAAAAkeVfEAAWUdhFEJeYmG0KpgXAZoZ4tHXg');

app.get('/', (req, res) => {
  res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file"><input type="submit"></form>');
});

app.post('/upload', [
  Auth(),
  (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (!['audio/mp3', 'audio/mpeg'].includes(mimetype)) {
        file.resume();
        res.status(406).send({ error: 'UnsupportedFile' });
        return;
      }

      yandexDiskApi.uploadFileFromStream(Path.basename(filename), file)
        .then((data) => {
          const song = new DB.Song({
            author: 'author',
            title: 'title',
            uploadedBy: 'admin',
            hash: 'hash',
            url: data.url,
          });
          res.status(201).send(data);
        })
        .catch(() => {
          file.resume();
          res.status(406).send({ error: 'UploadError' });
        });
    });
    req.pipe(busboy);
  },
]);

app.listen(process.env.PORT || 8080);
