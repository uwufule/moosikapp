const withPlugins = require('next-compose-plugins');
const withFonts = require('next-fonts');
const withImages = require('next-images');

const nextConfig = {
  poweredByHeader: false,
};

module.exports = withPlugins(
  [
    [withFonts, {}],
    [withImages, {}],
  ],
  nextConfig,
);
