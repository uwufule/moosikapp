import baseRequest from './baseRequest';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const updateTokenChain = async (refresh: string): Promise<RefreshResponse> => {
  const res = await baseRequest(`/login/refresh?refreshToken=${refresh}`, {
    method: 'GET',
  });

  const { token: accessToken, refreshToken } = res.data;

  return {
    accessToken,
    refreshToken,
  };
};

export default updateTokenChain;
