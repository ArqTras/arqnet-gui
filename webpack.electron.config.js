/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  // Main process
  {
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'source-map',
    entry: './main.ts',
    target: 'electron-main',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          use: [{ loader: 'babel-loader' }],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    optimization: {
      minimize: false
    }
  },
  // Preload script
  {
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'source-map',
    entry: './preload.ts',
    target: 'electron-preload',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          use: [{ loader: 'babel-loader' }],
          exclude: /node_modules/
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'preload.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    optimization: {
      minimize: false
    }
  }
];
