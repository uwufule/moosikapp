import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';

const useUserRestriction = () => {
  const allowOnlyAuthorizedUser = () => {
    const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);

    const router = useRouter();

    useEffect(() => {
      if (!accessToken) {
        router.push(`/login?from=${router.asPath}`);
      }
    }, [accessToken]);
  };

  const disallowAuthorizedUser = () => {
    const router = useRouter();

    const isLoggedIn = useSelector<RootState, boolean>((state) => state.login.accessToken !== '');

    useEffect(() => {
      if (isLoggedIn) {
        router.push(router.query?.from?.toString() || '/');
      }
    }, [isLoggedIn]);
  };

  return {
    allowOnlyAuthorizedUser, disallowAuthorizedUser,
  };
};

export default useUserRestriction;
