import { AxiosRequestConfig } from 'axios';
import lodash from 'lodash';
import baseRequest from './baseRequest';

const authorizedRequest = (
  url: string,
  accessToken: string,
  config?: AxiosRequestConfig,
) => baseRequest(
  url,
  {
    ...lodash.merge(config, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }),
  },
);

export default authorizedRequest;
