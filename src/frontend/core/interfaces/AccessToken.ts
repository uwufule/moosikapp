interface AccessToken {
  sub: string;
  scope: number;
  iat: number;
  exp: number;
}

export default AccessToken;
