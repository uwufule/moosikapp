import Layout from '@components/Layout';
import createStore from '@redux/store';
import withRedux from 'next-redux-wrapper';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

interface AppProps {
  Component: React.FC;
  store: Store;
}

const App = ({ Component, store }: AppProps) => (
  <Provider store={store}>
    <Head>
      <title>Moosik</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="application-name" content="Moosik" />
      <meta name="keywords" content="moosikapp, moosik, music, anime" />
      <meta name="description" content="Cool music app." />
      <link href="/favicon.ico" rel="icon" />
      <link rel="apple-touch-icon" sizes="256x256" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#27292d" />
    </Head>
    <Layout>
      <Component />
    </Layout>
  </Provider>
);

export default withRedux(createStore)(App);
