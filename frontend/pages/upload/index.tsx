import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import SongUploadForm from '../../components/SongUploadForm';
import { selectIsAuthorized } from '../../redux/auth/selectors';

const Upload: React.FC = () => {
  const isAutorized = useSelector(selectIsAuthorized);

  const router = useRouter();

  useEffect(() => {
    if (!isAutorized) {
      router.push(`/signin?from=${router.pathname}`);
    }
  }, [isAutorized]);

  return (
    <Layout>
      <SongUploadForm />
    </Layout>
  );
};

export default Upload;
