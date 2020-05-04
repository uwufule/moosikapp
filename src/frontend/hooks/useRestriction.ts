import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';

const useRestriction = () => {
  const router = useRouter();

  const isLoggedIn = useSelector<RootState, boolean>((state) => state.auth.accessToken !== '');

  const allowOnlyAuthorizedUser = () => {
    useEffect(() => {
      if (!isLoggedIn) {
        router.push(`/login?from=${router.asPath}`);
      }
    }, [isLoggedIn]);
  };

  const disallowAuthorizedUser = () => {
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

export default useRestriction;
