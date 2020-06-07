import { FC } from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import Head from 'next/head';
import createStore from '@redux/store';
import Layout from '@components/Layout';

interface AppProps {
  Component: FC<{ statusCode?: number }>;
  pageProps: {
    statusCode?: number;
  },
  store: Store;
}

const App = ({ Component, store }: AppProps) => (
  <Provider store={store}>
    <Head>
      <title>Moosik</title>
    </Head>
    <Layout>
      <Component />
    </Layout>
  </Provider>
);

export default withRedux(createStore)(App);
