import { Request, Response, RequestHandler } from 'express';
import JWT from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import { getUserByUuid } from '../../../mongodb/users';
import { isRefreshTokenExists, deleteRefreshToken } from '../../../mongodb/refreshTokens';
import createTokenPair from '../../../utils/tokenPair';

import messages from './messages.json';

interface RefreshTokenRecord {
  id: string;
  userId: string;
  iat: number;
  exp: number;
}

const { JWT_SECRET } = process.env;

export default (): RequestHandler => async (req: Request, res: Response) => {
  let jwt;
  try {
    jwt = <RefreshTokenRecord>JWT.verify(req.query.refreshToken, String(JWT_SECRET));
  } catch (e) {
    throw new HttpErrors.BadRequest(messages.refresh.INVALID_REFRESH_TOKEN);
  }

  const searchResult = await isRefreshTokenExists(jwt.id);
  if (!searchResult) {
    throw new HttpErrors.BadRequest(messages.refresh.TOKEN_EXPIRED);
  }

  const user = await getUserByUuid(jwt.userId);
  if (!user) {
    throw new HttpErrors.BadRequest(messages.refresh.GET_FOR_DEACTIVATED_USER);
  }

  await deleteRefreshToken(jwt.id);

  const tokenPair = await createTokenPair(user);
  res.status(200).send(tokenPair);
};
