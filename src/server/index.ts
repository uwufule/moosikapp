import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import BodyParser from 'body-parser';
import connectToMongoDB from './mongodb';
import routes from './routes';
import asyncErrorHandler from './middlewares/asyncErrorHandler';

import { MAX_FILE_SIZE } from './config/constants.json';

const init = async () => {
  const app = express();

  await connectToMongoDB();

  app.use(helmet({ hsts: false }));
  app.use(cors());

  app.use(BodyParser.json());
  app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

  app.use(routes());

  app.use(asyncErrorHandler);

  return app;
};

export default init;
