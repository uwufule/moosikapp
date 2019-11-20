import { Request, Response } from 'express';
import { Readable } from 'stream';
import uuidv4 from 'uuid/v4';
import request from 'request';
import { AuthorizedRequest } from '../../../middlewares/authorization';
import * as DB from '../../../apis/mongodb/songs';

const { CDN_SERVER = '' } = process.env;

const uploadTargetList = new Map<string, NodeJS.Timeout>();

export default (req: AuthorizedRequest, res: Response) => {
  const uploadTarget = uuidv4();

  uploadTargetList.set(uploadTarget, setTimeout(() => {
    uploadTargetList.delete(uploadTarget);
  }, 600000));

  const readable = new Readable();
  readable._read = () => {}; // eslint-disable-line

  readable.push(req.body);
  readable.push(null);

  const targetUri = `${CDN_SERVER}/upload-target/${uploadTarget}`;

  readable.pipe(request.put(targetUri, {
    headers: {
      'content-type': req.headers['content-type'],
    },
  }, async (error, { statusCode }, body) => {
    if (error) {
      res.status(500).send({ message: 'Internal server error.' });
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

    const message = body || 'Error while uploading.';
    res.status(400).send({ message });
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

    const uploadTarget = uploadTargetList.get(uuid);
    if (uploadTarget !== undefined) {
      clearTimeout(uploadTarget);
    }
    uploadTargetList.delete(uuid);
  };
}
