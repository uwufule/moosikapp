import Path from 'path';
import Express from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import mongoDB from './apis/mongodb';
import withApi from './endpoints';

import { MAX_FILE_SIZE } from './config.json';

const { PORT } = process.env;

mongoDB();

const app = Express();

app.disable('x-powered-by');
app.disable('etag');

app.use(Express.static(Path.resolve('./static'), { etag: false }));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

app.use(cors());

app.use(errorHandler());

withApi(app);

app.listen(PORT);
