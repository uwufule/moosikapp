import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';

const useWithoutAuthorization = () => {
  const router = useRouter();

  const isLoggedIn = useSelector<RootState, boolean>((state) => state.login.accessToken !== '');

  useEffect(() => {
    if (isLoggedIn) {
      router.back();
    }
  }, [isLoggedIn]);
};

export default useWithoutAuthorization;
