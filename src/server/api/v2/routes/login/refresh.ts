import { Request, Response, RequestHandler } from 'express';
import JWT, { TokenExpiredError } from 'jsonwebtoken';
import { BadRequest } from 'http-errors';
import { getAuthPayloadById } from '../../../../database/mongo/users';
import { isRefreshTokenExists } from '../../../../database/mongo/refreshTokens';
import { updateTokens, RefreshToken } from '../../utils/tokens';

const JWT_SECRET = String(process.env.JWT_SECRET);

const isInvalidString = (value: any) => typeof value !== 'string';

const decodeRefreshToken = (refreshToken: string) => {
  try {
    return <RefreshToken>JWT.verify(refreshToken, JWT_SECRET);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      throw new BadRequest('Refresh token expired.');
    }

    throw new BadRequest('Invalid refresh token.');
  }
};

export default (): RequestHandler => async (req: Request, res: Response) => {
  const { refreshToken } = req.query;
  if (isInvalidString(refreshToken)) {
    throw new BadRequest('Invalid refresh token.');
  }

  const { jti: tokenId, sub: userId } = decodeRefreshToken(<string>refreshToken);

  if (!(await isRefreshTokenExists(tokenId))) {
    throw new BadRequest('Refresh token expired.');
  }

  const auth = await getAuthPayloadById(userId);
  if (!auth) {
    throw new BadRequest('Trying to get tokens for deactivated user.');
  }

  const newTokens = await updateTokens(auth.uuid, auth.role, tokenId);
  res.status(200).send(newTokens);
};
