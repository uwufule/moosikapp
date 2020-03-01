const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const config = {
  poweredByHeader: false,
};

exports.default = withPlugins([
  withImages,
], config);
