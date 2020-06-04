import { Router } from 'express';
import v2 from './v2';

export default () => {
  const router = Router();

  router.use('/v2', v2());

  return router;
};
