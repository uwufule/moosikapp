import { Response, RequestHandler } from 'express';
import { Gone } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import { revokeRefreshTokens } from '../../../../mongodb/refreshTokens';

export default (): RequestHandler => (
  async (req: AuthRequest, res: Response) => {
    if (!(await revokeRefreshTokens(req.auth.uuid))) {
      throw new Gone('Already logged out.');
    }

    res.status(200).send({ message: 'Successfully logged out.' });
  }
);
