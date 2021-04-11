import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export const decodeToken = <T>(token: string) => {
  return <T | null>jwt.decode(token, { json: true });
};

export const isTokenExpiresSoon = <T extends { exp: number; iat: number }>(token: string) => {
  const decoded = decodeToken<T>(token);
  if (!decoded) {
    throw new JsonWebTokenError('Invalid token');
  }

  return decoded.exp * 1000 - Date.now() < 60;
};
