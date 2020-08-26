import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import MongoDB from './database/mongo';
import asyncErrorHandler from './middlewares/asyncErrorHandler';
import api from './api';

const init = async () => {
  await MongoDB.connect();

  const app = express();

  app.use(helmet({ hsts: false }));
  app.use(cors());

  app.use('api', api());

  app.use(asyncErrorHandler);

  return app;
};

export default init;
