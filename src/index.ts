import Path from 'path';
import Express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import BodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import mongoDB from './api/mongodb';
import withApiEndpoints from './endpoints';

import { MAX_FILE_SIZE } from './config/constants.json';

const { PORT } = process.env;

const app = Express();

mongoDB();

app.use(helmet({ hsts: false }));
app.use(cors());

app.use(Express.static(Path.resolve('static')));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

withApiEndpoints(app);

<<<<<<< HEAD
  app.get('*', (req, res) => {
    res.status(200).sendFile(Path.resolve('static/index.html'));
  });

  app.use(errorHandler());
=======
app.use(errorHandler());
>>>>>>> d5998c00e5410f005716f930f88a92be602a25bc

app.listen(Number(PORT));

export default app;
