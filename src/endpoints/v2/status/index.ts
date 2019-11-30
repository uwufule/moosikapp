import { Request, Response } from 'express';

export default () => async (req: Request, res: Response) => {
  try {
    res.status(501).send();
  } catch (e) {
    res.status(500).send({ message: 'Internal server error.' });
  }
};
