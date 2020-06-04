import { Router, Request, Response } from 'express';
import api from './api';

const routeNotFound = () => (
  (req: Request, res: Response) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  }
);

export default () => {
  const router = Router();

  router.use('/api', api());

  router.all('*', routeNotFound());

  return router;
};
