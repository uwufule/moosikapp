const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withSass = require('@zeit/next-sass');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

const nextConfig = {
  poweredByHeader: false,
};

exports.default = withPlugins([
  [withImages, {}],
  [withSass, {
    cssModules: true,
    cssLoadeOptions: {
      localIdentName: '[path]__[local]__[hash:base64:5]',
    },
    [PHASE_PRODUCTION_BUILD]: {
      cssLoadeOptions: {
        localIdentName: 'css-[hash:base64:5]',
      },
    },
  }],
], nextConfig);
