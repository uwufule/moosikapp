import JWT from 'jsonwebtoken';
import { PrivateUserData } from '../mongodb/users';

const { JWT_SECRET } = process.env;

export interface TokenChain {
  token: string;
  refreshToken: string;
}

export default (user: PrivateUserData, hex: string): TokenChain => {
  const token = JWT.sign({
    uuid: user.uuid,
    role: user.role,
  }, String(JWT_SECRET), { expiresIn: '30m' });

  const refreshToken = JWT.sign({
    userId: user.uuid,
    hex,
  }, String(JWT_SECRET), { expiresIn: '60d' });

  return { token, refreshToken };
};
