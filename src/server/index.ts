import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectToMongoDB from './mongodb';
import routes from './routes';
import asyncErrorHandler from './middlewares/asyncErrorHandler';

const init = async () => {
  const app = express();

  await connectToMongoDB();

  app.use(helmet({ hsts: false }));
  app.use(cors());

  app.use(routes());

  app.use(asyncErrorHandler);

  return app;
};

export default init;
