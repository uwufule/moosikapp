import OS from 'os';
import { Request, Response, RequestHandler } from 'express';
import request from 'request-promise';

const { CDN_SERVER = '' } = process.env;

export default (): RequestHandler => async (req: Request, res: Response) => {
  const status = await request(`${CDN_SERVER}/status.json`);
  res.status(200).send({
    api: {
      cpu: {
        loadavg: OS.loadavg(),
      },
      memory: {
        free: OS.freemem(),
        total: OS.totalmem(),
      },
      serverTime: new Date(),
    },
    cdn: JSON.parse(status),
  });
};
