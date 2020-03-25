import request from './baseRequest';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const login = async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
  const res = await request(
    '/login',
    {
      method: 'POST',
      data: {
        username: usernameOrEmail,
        password,
      },
    },
  );

  const { token: accessToken, refreshToken } = res.data;

  return {
    accessToken,
    refreshToken,
  };
};

export default login;
