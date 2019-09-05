import { Request, Response } from 'express';

export default () => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).send({ message: 'Not implemented.' });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
