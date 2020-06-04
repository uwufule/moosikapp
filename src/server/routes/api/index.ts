import { Router } from 'express';
import BodyParser from 'body-parser';
import { MethodNotAllowed } from 'http-errors';
import v2 from './v2';
import { MAX_FILE_SIZE } from '../../config/constants.json';

export default () => {
  const router = Router();

  router.use(BodyParser.json());
  router.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

  router.use('/v2', v2());

  router.all('*', () => {
    // or 'The resource you are trying to request does not exist.'
    throw new MethodNotAllowed('Method not allowed.');
  });

  return router;
};
