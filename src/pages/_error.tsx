import React from 'react';
import { NextPageContext } from 'next';

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps) => (
  <p>
    {statusCode
      ? `An error ${statusCode} occurred on server`
      : 'An error occurred on client'}
  </p>
);

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res.statusCode || err.statusCode || 404;

  return {
    statusCode,
  };
};

export default ErrorPage;
