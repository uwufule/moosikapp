import Document, { Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Head from '@components/Head';

export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const styleSheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          (props) => styleSheet.collectStyles(<App {...props} />)
        ),
      });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styleSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styleSheet.seal();
    }
  }

  render() {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
