import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import uuidv4 from 'uuid/v4';
import request from 'request';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as DB from '../../../apis/mongodb/songs';
import APIError from '../../../errors/APIError';

const { CDN_SERVER = '' } = process.env;

const uploadTargetList = new Map<string, NodeJS.Timeout>();

export default (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const uploadTargetId = uuidv4();

  uploadTargetList.set(uploadTargetId, setTimeout(() => {
    uploadTargetList.delete(uploadTargetId);
  }, 600000));

  const readable = new Readable();
  readable._read = () => {}; // eslint-disable-line

  readable.push(req.body);
  readable.push(null);

  const targetUri = `${CDN_SERVER}/upload-target/${uploadTargetId}`;

  readable.pipe(request.put(targetUri, {
    headers: {
      'content-type': req.headers['content-type'],
    },
  }, async (error, { statusCode }, body) => {
    if (error) {
      next(new APIError(500, 'Internal server error.'));
      return;
    }

    if (statusCode === 201) {
      const uuid = uuidv4();

      await DB.saveSong({
        uuid,
        uploadedBy: req.jwt.uuid,
        path: body,
        likes: [req.jwt.uuid],
      });

      res.status(statusCode).send({
        message: 'You have successfully uploaded a new song.',
        uuid,
      });
      return;
    }

    next(new APIError(400, body || 'Error while uploading.'));
  }));
};

export function verify() {
  return (req: Request, res: Response) => {
    const { uuid } = req.query;

    if (!uploadTargetList.has(uuid)) {
      res.status(400).send();
      return;
    }

    res.status(200).send();

    const uploadTargetId = uploadTargetList.get(uuid);
    if (uploadTargetId !== undefined) {
      clearTimeout(uploadTargetId);
    }

    uploadTargetList.delete(uuid);
  };
}
