import JWT from 'jsonwebtoken';
import { createRefreshToken } from '../mongodb/refreshTokens';
import { PrivateUserData } from '../mongodb/users';

const { JWT_SECRET } = process.env;

export interface TokenPair {
  token: string;
  refreshToken: string;
}

export default async (user: PrivateUserData): Promise<TokenPair> => {
  const refreshTokenId = await createRefreshToken(user.uuid);

  const token = JWT.sign({
    uuid: user.uuid,
    role: user.role,
  }, String(JWT_SECRET), { expiresIn: '30m' });

  const refreshToken = JWT.sign({
    userId: user.uuid,
    id: refreshTokenId,
  }, String(JWT_SECRET), { expiresIn: '60d' });

  return { token, refreshToken };
};
