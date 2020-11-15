import AccessToken from '@core/interfaces/AccessToken';
import JWT from 'jsonwebtoken';

const tryDecodeAccessToken = (accessToken: string) => {
  return <AccessToken | null>JWT.decode(accessToken);
};

export default tryDecodeAccessToken;
