import useRequest from './useRequest';

const useReleaseTokens = () => {
  const request = useRequest();

  return async (refreshToken: string) => {
    const res = await request(
      '/login/refresh',
      {
        method: 'GET',
        params: {
          refreshToken,
        },
      },
    );

    return res;
  };
};

export default useReleaseTokens;
