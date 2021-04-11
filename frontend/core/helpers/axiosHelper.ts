import axios, { AxiosError } from 'axios';

const BASE_API_ADDRESS = '/api/v3';

interface ApiErrorData {
  message: string;
}

export const isSuccessStatus = (status: number) => {
  return status >= 200 && status < 300;
};

export const createAxiosInstance = (token?: string) => {
  const axiosInstance = axios.create({
    baseURL: BASE_API_ADDRESS,
    headers: {
      accept: 'application/json',
    },
  });

  if (token) {
    axiosInstance.interceptors.request.use((requestConfig) => {
      requestConfig.headers.authorization = `Bearer ${token}`;

      return requestConfig;
    });
  }

  axiosInstance.interceptors.response.use(undefined, (error: AxiosError<ApiErrorData>) => {
    if (error.response && !isSuccessStatus(error.response.status)) {
      const message = error.response.data.message || error.response.statusText;
      throw new Error(message);
    }
  });

  return axiosInstance;
};
