import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const ErrorName = styled.h2`
  color: #fff;
`;

const ErrorDescription = styled.div`
  color: #c7ccd8;
`;

const NotFound: React.FC = () => (
  <Layout>
    <ErrorName>404</ErrorName>
    <ErrorDescription>
      <p>An error 404 occurred on server</p>
    </ErrorDescription>
  </Layout>
);

export default NotFound;
