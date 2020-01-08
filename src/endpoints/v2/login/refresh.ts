import { Request, Response } from 'express';
import Crypto from 'crypto';
import JWT, { JsonWebTokenError } from 'jsonwebtoken';
import { getByUuid } from '../../../api/mongodb/users';
import { contains, update, RefreshTokenRecord } from '../../../api/mongodb/tokens';
import APIError from '../../../errors/APIError';

import messages from './messages.json';

interface RefreshTokenJWT extends RefreshTokenRecord {
  iat: number;
  exp: number;
}

const { JWT_SECRET } = process.env;

export default () => async (req: Request, res: Response) => {
  try {
    const jwt = JWT.verify(req.query.refreshToken, String(JWT_SECRET)) as RefreshTokenJWT;

    const searchResult = await contains({ userId: jwt.userId, payload: jwt.payload });
    if (!searchResult) {
      throw new APIError(400, messages.refresh.TOKEN_EXPIRED);
    }

    const user = await getByUuid(jwt.userId);
    if (!user) {
      throw new APIError(400, messages.refresh.GET_FOR_DEACTIVATED_USER);
    }

    const token = JWT.sign({
      uuid: user.uuid,
      role: user.role,
    }, String(JWT_SECRET), { expiresIn: '1d' });

    const payload = Crypto.randomBytes(6).toString('hex');
    const refreshToken = JWT.sign({
      userId: user.uuid,
      payload,
    }, String(JWT_SECRET), { expiresIn: '30d' });

    await update(jwt.payload, payload);

    res.status(200).send({ token, refreshToken });
  } catch (e) {
    if (e instanceof APIError) {
      res.status(e.statusCode).send({ message: e.message });
      return;
    }

    if (e instanceof JsonWebTokenError) {
      res.status(400).send({ message: messages.refresh.INVALID_REFRESH_TOKEN });
      return;
    }

    res.status(500).send({ message: 'Internal server error.', e });
  }
};
