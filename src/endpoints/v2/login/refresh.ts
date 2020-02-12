import { Request, Response, RequestHandler } from 'express';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import { getUserByUuid } from '../../../api/mongodb/users';
import { createTokenChain } from '.';

import messages from './messages.json';

interface RefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

const { JWT_SECRET } = process.env;

export default (): RequestHandler => async (req: Request, res: Response) => {
  let jwt;
  try {
    jwt = <RefreshToken>JWT.verify(req.query.refreshToken, String(JWT_SECRET));
  } catch (e) {
    throw new HttpErrors.BadRequest(messages.refresh.INVALID_REFRESH_TOKEN);
  }

  const searchResult = await contains({ userId: jwt.userId, hex: jwt.hex });
  if (!searchResult) {
    throw new HttpErrors.BadRequest(messages.refresh.TOKEN_EXPIRED);
  }

  const user = await getByUuid(jwt.userId);
  if (!user) {
    throw new HttpErrors.BadRequest(messages.refresh.GET_FOR_DEACTIVATED_USER);
  }

  const hex = Crypto.randomBytes(12).toString('hex');
  const tokenChain = createTokenChain(user, hex);

  await update(jwt.hex, hex);

  res.status(200).send(tokenChain);
};
