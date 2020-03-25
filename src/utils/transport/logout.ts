import authorizedRequest from './authorizedRequest';

const logout = async (accessToken: string): Promise<boolean> => {
  const res = await authorizedRequest(
    '/logout',
    accessToken,
    {
      method: 'POST',
    },
  );

  return res.status === 200;
};

export default logout;
