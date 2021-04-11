import { createAxiosInstance } from '../../helpers/axiosHelper';
import { decodeToken } from '../../helpers/tokenHelper';
import UserData from '../../interfaces/UserData';
import ApiResponse from './interfaces/ApiResponse';

export const getMe = async (accessToken: string) => {
  const userId = decodeToken<{ sub: string }>(accessToken)?.sub;

  const res = await createAxiosInstance(accessToken).get<ApiResponse<UserData>>(`users/${userId}`);
  return res.data.result;
};
