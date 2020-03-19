import { FC } from 'react';
import { AppContext } from 'next/app';
import Head from 'next/head';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import Layout from '../components/Layout';

import createStore from '../redux/store';

interface AppProps {
  Component: FC<{ statusCode?: number }>;
  pageProps: {
    statusCode?: number;
  },
  store: Store;
}

const App = ({ Component, pageProps, store }: AppProps) => (
  <Provider store={store}>
    <Head>
      <title>Moosik</title>
    </Head>
    <Layout>
      <Component statusCode={pageProps?.statusCode} />
    </Layout>
  </Provider>
);

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = typeof Component.getInitialProps === 'function'
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

export default withRedux(createStore)(App);
