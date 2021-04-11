import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { useSelector } from 'react-redux';
import { Normalize as NormalizeStyles } from 'styled-normalize';
import GlobalStyles from '../components/Layout/GlobalStyles';
import Player from '../components/Player';
import { selectIsAuthorized } from '../redux/auth/selectors';
import { nextReduxWrapper } from '../redux/store';

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  const isAuthorized = useSelector(selectIsAuthorized);

  return (
    <>
      <Head>
        <title>Moosik</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="application-name" content="moosikapp" />
        <meta name="keywords" content="moosikapp, moosik, music, anime" />
        <meta name="description" content="moosikapp" />
        <link href="/favicon.ico" rel="icon" />
        <link rel="apple-touch-icon" sizes="256x256" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#27292d" />
      </Head>
      <GlobalStyles />
      <NormalizeStyles />
      <Component {...pageProps} />
      {isAuthorized && <Player />}
    </>
  );
};

export default nextReduxWrapper.withRedux(WrappedApp);
