import next from 'next';
import { Request, Response } from 'express';
import app from './server';

const { NODE_ENV, PORT } = process.env;

const nextApp = next({ dev: NODE_ENV !== 'production' });
const handler = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    app.get('*', (req: Request, res: Response) => {
      handler(req, res);
    });

    app.listen(Number(PORT));
  });
