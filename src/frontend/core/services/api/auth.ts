import createAxiosInstance from '@core/infrastructure/transport/createAxiosInstance';
import Token from '@core/models/Token';
import ApiResponse from './interfaces/ApiResponse';
import SignupData from './interfaces/SignupData';
import SignupResult from './interfaces/SignupResult';

const AxiosInstance = createAxiosInstance();

export const signup = async (data: SignupData): Promise<string> => {
  const res = await AxiosInstance.post<ApiResponse<SignupResult>>('/signup', data);

  return res.data.result.id;
};

export const login = async (username: string, password: string): Promise<Token> => {
  const res = await AxiosInstance.post<ApiResponse<Token>>('/login', {
    username,
    password,
  });

  return res.data.result;
};

export const refresh = async (refreshToken: string): Promise<Token> => {
  const res = await AxiosInstance.post<ApiResponse<Token>>('/login/refresh', {
    refreshToken,
  });

  return res.data.result;
};

export const logout = async (accessToken: string): Promise<boolean> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).post<ApiResponse<undefined>>(
    '/logout',
    undefined,
  );

  return res.status >= 200 && res.status < 300;
};
