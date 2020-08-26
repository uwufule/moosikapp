import { Router } from 'express';
import BodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import v2 from './v2';

export default () => {
  const api = Router();

  api.use(BodyParser.json());

  api.use('/v2', v2());

  api.all('*', () => {
    throw new HttpErrors.MethodNotAllowed('Method not allowed.');
  });

  return api;
};
