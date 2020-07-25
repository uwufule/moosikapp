import { Request, Response, RequestHandler } from 'express';
import JWT from 'jsonwebtoken';
import { BadRequest } from 'http-errors';
import { getAuthPayloadById } from '../../../../mongodb/users';
import { isRefreshTokenExists } from '../../../../mongodb/refreshTokens';
import { updateTokens, RefreshToken } from '../../../../utils/tokens';

const { JWT_SECRET } = process.env;

const getRefreshTokenPayload = (refreshToken: string) => {
  try {
    return <RefreshToken>JWT.verify(refreshToken, String(JWT_SECRET));
  } catch (e) {
    if (e instanceof JWT.TokenExpiredError) {
      throw new BadRequest('Refresh token expired.');
    }

    throw new BadRequest('Invalid refresh token.');
  }
};

export default (): RequestHandler => async (req: Request, res: Response) => {
  const { refreshToken } = req.query;
  if (typeof refreshToken !== 'string') {
    throw new BadRequest('Invalid refresh token.');
  }

  const payload = getRefreshTokenPayload(refreshToken);

  if (!(await isRefreshTokenExists(payload.jti))) {
    throw new BadRequest('Refresh token expired.');
  }

  const authPayload = await getAuthPayloadById(payload.sub);
  if (!authPayload) {
    throw new BadRequest('Trying to get tokens for deactivated user.');
  }

  const tokens = await updateTokens(authPayload, payload.jti);
  res.status(200).send(tokens);
};
