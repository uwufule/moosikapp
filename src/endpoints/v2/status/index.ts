import { Request, Response, RequestHandler } from 'express';
import reqeust from 'request-promise';

const { CDN_SERVER = '' } = process.env;

export default (): RequestHandler => async (req: Request, res: Response) => {
  const status = await reqeust(`${CDN_SERVER}/status.json`);
  res.status(200).send(status);
};
