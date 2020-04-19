import next from 'next';
import { Request, Response } from 'express';
import server from './server';

const { NODE_ENV, PORT } = process.env;

const app = next({ dir: 'src/frontend', dev: NODE_ENV !== 'production' });
const handler = app.getRequestHandler();

app.prepare()
  .then(() => {
    server.get('*', (req: Request, res: Response) => {
      handler(req, res);
    });

    server.listen(Number(PORT));
  });
