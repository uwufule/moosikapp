import React from 'react';
import { NextPageContext } from 'next';
import Error from '../components/Error';

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps) => (
  <Error
    title={String(statusCode)}
    message={[
      `An error ${statusCode} occurred on server`,
    ]}
  />
);

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;

  return {
    statusCode,
  };
};

export default ErrorPage;
