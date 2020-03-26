import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';

const useWithAuthorization = () => {
  const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken]);
};

export default useWithAuthorization;
