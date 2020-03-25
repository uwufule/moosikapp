import baseRequest from './baseRequest';

const registerNewAccount = async (
  username: string, email: string, password: string,
): Promise<boolean> => {
  const res = await baseRequest(
    '/register',
    {
      method: 'POST',
      data: {
        username, email, password,
      },
    },
  );

  return res.status === 201;
};

export default registerNewAccount;
