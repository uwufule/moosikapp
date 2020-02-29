import { AppContext } from 'next/app';
import { FC } from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import makeStore from '../redux/store';

interface AppProps {
  Component: FC<{ statusCode?: number }>;
  pageProps: {
    statusCode?: number;
  },
  store: Store;
}

const App = ({ Component, pageProps, store }: AppProps) => (
  <Provider store={store}>
    <div>
      <Component statusCode={pageProps?.statusCode} />
    </div>
  </Provider>
);

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = typeof Component.getInitialProps === 'function'
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

export default withRedux(makeStore)(App);
