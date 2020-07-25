import JWT from 'jsonwebtoken';
import { createRefreshToken, deleteRefreshToken } from '../mongodb/refreshTokens';
import { AuthPayload } from '../mongodb/users';

const JWT_SECRET = String(process.env.JWT_SECRET);

interface AccessTokenPayload {
  uuid: string;
  role: number;
}

export interface AccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

const signAccessToken = (payload: AccessTokenPayload) =>
  JWT.sign(payload, JWT_SECRET, { expiresIn: '30m' });

interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

export interface RefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

const signRefreshToken = (payload: RefreshTokenPayload) =>
  JWT.sign(payload, JWT_SECRET, { expiresIn: '30d' });

export const createTokens = async (auth: AuthPayload) => {
  const accessToken = signAccessToken(auth);

  const refreshToken = signRefreshToken({
    jti: await createRefreshToken(auth.uuid),
    sub: auth.uuid,
  });

  return { accessToken, refreshToken };
};

export const updateTokens = async (auth: AuthPayload, jti: string) => {
  const accessToken = signAccessToken(auth);

  await deleteRefreshToken(jti);

  const refreshToken = signRefreshToken({
    jti: await createRefreshToken(auth.uuid),
    sub: auth.uuid,
  });

  return { accessToken, refreshToken };
};
