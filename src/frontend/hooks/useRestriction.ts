import { selectIsLoggedIn } from '@redux/auth/selectors';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useRestriction = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const router = useRouter();

  const requireAuth = () => {
    useEffect(() => {
      if (!isLoggedIn) {
        router.push(`/login?from=${router.asPath}`);
      }
    }, [isLoggedIn]);
  };

  const forbidAuth = () => {
    useEffect(() => {
      if (isLoggedIn) {
        router.push(router.query?.from?.toString() || '/');
      }
    }, [isLoggedIn]);
  };

  return { requireAuth, forbidAuth };
};

export default useRestriction;
