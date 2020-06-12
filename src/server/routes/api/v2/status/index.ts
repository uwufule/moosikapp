import OS from 'os';
import { Request, Response, RequestHandler } from 'express';
import request from 'node-fetch';

const { CDN_SERVER = '' } = process.env;

export default (): RequestHandler => async (req: Request, res: Response) => {
  const api = {
    cpu: {
      loadavg: OS.loadavg(),
    },
    memory: {
      free: OS.freemem(),
      total: OS.totalmem(),
    },
    serverTime: new Date(),
  };

  try {
    const cdnRes = await request(`${CDN_SERVER}/status.json`);
    res.status(200).send({ api, cdn: await cdnRes.json() });
  } catch {
    res.status(200).send({ api, cdn: 'unavailable' });
  }
};
