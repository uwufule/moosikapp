import { createAxiosInstance, isSuccessStatus } from '../../helpers/axiosHelper';
import Token from '../../interfaces/Token';
import ApiResponse from './interfaces/ApiResponse';

const axiosInstance = createAxiosInstance();

interface SignupResult {
  id: string;
}

export const signup = async (username: string, email: string, password: string) => {
  const res = await axiosInstance.post<ApiResponse<SignupResult>>('/signup', {
    username,
    email,
    password,
  });

  return res.data.result;
};

interface SigninResult extends Token {}

export const signin = async (username: string, password: string) => {
  const res = await axiosInstance.post<ApiResponse<SigninResult>>('/signin', {
    username,
    password,
  });

  return res.data.result;
};

interface RefreshResult extends Token {}

export const refresh = async (refreshToken: string) => {
  const res = await axiosInstance.post<ApiResponse<RefreshResult>>('/signin/refresh', {
    refreshToken,
  });

  return res.data.result;
};

export const logout = async (accessToken: string): Promise<boolean> => {
  const res = await createAxiosInstance(accessToken).post<ApiResponse>('/logout');

  return isSuccessStatus(res.status);
};
