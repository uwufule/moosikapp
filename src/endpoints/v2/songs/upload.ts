import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import UUID from 'uuid';
import request from 'request';
import * as Songs from '../../../api/mongodb/songs';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import APIError from '../../../errors/APIError';

const { CDN_SERVER = '' } = process.env;

const uploadTargetList = new Map<string, NodeJS.Timeout>();

export default (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const uploadTarget = UUID.v4();

  uploadTargetList.set(uploadTarget, setTimeout(() => {
    uploadTargetList.delete(uploadTarget);
  }, 600000));

  const readable = new Readable();
  readable._read = () => {}; // eslint-disable-line no-underscore-dangle

  readable.push(req.body);
  readable.push(null);

  const targetUri = `${CDN_SERVER}/v1/upload-target/${uploadTarget}`;

  readable.pipe(request.put(targetUri, {
    headers: {
      'content-type': req.headers['content-type'],
    },
  }, async (error, response, body) => {
    if (error) {
      next(new APIError(500, 'Internal server error.'));
      return;
    }

    switch (response.statusCode) {
      case 201: {
        const uuid = await Songs.saveSong({ uploadedBy: req.jwt.uuid, path: body });
        res.status(201).send({
          message: 'You have successfully uploaded a new song.',
          uuid,
        });

        break;
      }
      default:
        next(new APIError(400, body || 'Error while uploading.'));
    }
  }));
};

export function verify() {
  return (req: Request, res: Response) => {
    const { uuid } = req.query;

    if (!uploadTargetList.has(uuid)) {
      res.status(400).send();
      return;
    }

    const uploadTarget = uploadTargetList.get(uuid);
    if (uploadTarget) {
      clearTimeout(uploadTarget);
    }
    uploadTargetList.delete(uuid);

    res.status(200).send();
  };
}
