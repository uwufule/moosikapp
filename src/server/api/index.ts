import { Router, Request, Response } from 'express';
import v2 from './endpoints/v2';

export default () => {
  const router = Router();

  router.use('/v2', v2());

  // 404 not found
  router.all('*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });

  return router;
};
