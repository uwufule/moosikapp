import Path from 'path';
import Express from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import mongoDB from './apis/mongodb';
import yandexDiskApi from './apis/yandex-disk';
import apiEndpoint from './endpoints';

const { MAX_FILE_SIZE } = require('./config.json');

const { PORT, YANDEX_DISK_API_TOKEN } = process.env;

mongoDB();
yandexDiskApi(YANDEX_DISK_API_TOKEN);

const app = Express();

app.disable('x-powered-by');
app.disable('etag');

app.use(Express.static(Path.resolve('./static'), { etag: false }));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

app.use(cors());

app.use(errorHandler());

app.get('/', (req, res) => {
  res.sendFile(Path.resolve('./html/index.html'));
});

apiEndpoint(app);

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT || 8080);
