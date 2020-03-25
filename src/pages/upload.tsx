import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import UploadForm from '../components/UploadForm';
import { RootState } from '../redux/store';

const Upload = () => {
  const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken]);

  return (
    <UploadForm />
  );
};

export default Upload;
