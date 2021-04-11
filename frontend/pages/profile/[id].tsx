import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';

const Profile: React.FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <h2 style={{ color: '#fff' }}>Account {router.query.id}</h2>
    </Layout>
  );
};

export default Profile;
