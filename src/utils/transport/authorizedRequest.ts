import baseRequest, { BaseRequestConfig } from './baseRequest';

const authorizedRequest = (
  url: string,
  accessToken: string,
  {
    method,
    headers,
    data,
  }: BaseRequestConfig,
) => baseRequest(
  url,
  {
    method,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    data,
  },
);

export default authorizedRequest;
