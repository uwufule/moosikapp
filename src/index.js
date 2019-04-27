import Path from 'path';
import Express from 'express';
import BodyParser from 'body-parser';

import YandexDiskApi from './apis/yandex-disk';
import MongoDB from './apis/mongodb';

import Api from './api';


YandexDiskApi(process.env.YANDEX_DISK_API_TOKEN);
MongoDB();


const app = Express();


app.use(Express.static(Path.resolve('./static')));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: '10mb' }));

app.use((error, req, res, next) => {
  if (!error) next();

  switch (error.message) {
    case 'request entity too large':
      res.send({ message: 'File too large.' });
      break;
    default:
      res.status(500).send();
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});


app.get('/', (req, res) => {
  res.sendFile(Path.resolve('./html/index.html'));
});


Api(app);


app.listen(process.env.PORT || 8080);
