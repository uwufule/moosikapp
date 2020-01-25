import { Request, Response } from 'express';
import Crypto from 'crypto';
import JWT, { JsonWebTokenError } from 'jsonwebtoken';
import { getByUuid } from '../../../api/mongodb/users';
import { contains, update, RefreshTokenPayload } from '../../../api/mongodb/tokens';
import { getTokenChain } from '.';
import APIError from '../../../errors/APIError';

import messages from './messages.json';

interface RefreshTokenRecord extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

const { JWT_SECRET } = process.env;

export default () => async (req: Request, res: Response) => {
  try {
    const jwt = <RefreshTokenRecord>JWT.verify(req.query.refreshToken, String(JWT_SECRET));

    const searchResult = await contains({ userId: jwt.userId, hex: jwt.hex });
    if (!searchResult) {
      throw new APIError(400, messages.refresh.TOKEN_EXPIRED);
    }

    const user = await getByUuid(jwt.userId);
    if (!user) {
      throw new APIError(400, messages.refresh.GET_FOR_DEACTIVATED_USER);
    }

    const hex = Crypto.randomBytes(12).toString('hex');
    const tokenChain = getTokenChain(user, hex);

    await update(jwt.hex, hex);

    res.status(200).send(tokenChain);
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    if (e instanceof JsonWebTokenError) {
      res.status(400).send({ message: messages.refresh.INVALID_REFRESH_TOKEN });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
