import { Head as NextHead } from 'next/document';

const Head = () => (
  <NextHead>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="application-name" content="Moosik" />
    <meta name="keywords" content="moosikapp, moosik, music, anime" />
    <meta name="description" content="Cool music app." />
    <link href="/favicon.ico" rel="icon" />
    <link rel="apple-touch-icon" sizes="256x256" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#f5f5f5" />
  </NextHead>
);

export default Head;
