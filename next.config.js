const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const nextConfig = {
  poweredByHeader: false,
};

exports.default = withPlugins([
  [withImages, {}],
], nextConfig);
