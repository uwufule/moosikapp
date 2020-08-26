import JWT from 'jsonwebtoken';
import { createRefreshTokenId, deleteRefreshTokenById } from '../database/mongo/refreshTokens';

const JWT_SECRET = String(process.env.JWT_SECRET);

interface AccessTokenPayload {
  sub: string;
  scope: number;
}

export interface AccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

export interface RefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

const signAccessToken = (userId: string, userRole: number) =>
  JWT.sign({ sub: userId, scope: userRole }, JWT_SECRET, { expiresIn: '30m' });

const signRefreshToken = (tokenId: string, userId: string) =>
  JWT.sign({ jti: tokenId, sub: userId }, JWT_SECRET, { expiresIn: '30d' });

export const createTokens = async (userId: string, userRole: number) => ({
  accessToken: signAccessToken(userId, userRole),
  refreshToken: signRefreshToken(await createRefreshTokenId(userId), userId),
});

export const updateTokens = async (userId: string, userRole: number, tokenId: string) => {
  await deleteRefreshTokenById(tokenId);
  return {
    accessToken: signAccessToken(userId, userRole),
    refreshToken: signRefreshToken(await createRefreshTokenId(userId), userId),
  };
};
