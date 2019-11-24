import Path from 'path';
import Express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import BodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import mongoDB from './apis/mongodb';
import withApi from './endpoints';

import { MAX_FILE_SIZE } from './config.json';

const { PORT = 8080 } = process.env;

mongoDB();

const app = Express();

app.use(helmet({ hsts: false }));

app.use(Express.static(Path.resolve('static')));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

app.use(cors());

withApi(app);

app.use(errorHandler());

app.listen(PORT);
