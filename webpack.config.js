/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');
const { version } = require('./package.json');

const prod = process.env.NODE_ENV === 'production';

if (!prod) {
  dotenv.config();
}

module.exports = {
  target: 'node',
  entry: './src/index.js',
  mode: prod ? 'production' : 'development',
  output: {
    path: path.resolve('./build'),
    filename: `server${process.env.VERSIONED ? version : ''}${prod ? '.min' : ''}.js`,
  },
  node: {
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  externals: [
    webpackNodeExternals(),
  ],
  devtool: prod ? false : 'source-map',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
