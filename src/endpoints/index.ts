import { Application, Request, Response } from 'express';
import v2 from './v2';

export default (app: Application): void => {
  v2(app);

  // 404 not found
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });
};
