import tryDecodeAccessToken from './tryDecodeAccessToken';

const isAccessTokenExpiresSoon = (accessToken: string) => {
  const payload = tryDecodeAccessToken(accessToken);
  if (!payload) {
    throw new Error('Invalid access token.');
  }

  const timeLeft = payload.exp * 1000 - Date.now();
  return timeLeft < 60;
};

export default isAccessTokenExpiresSoon;
