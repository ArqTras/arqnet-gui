/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
    fullySpecified: false,
    fallback: {
      "crypto": false,
      "fs": path.resolve(__dirname, 'src/fs-mock.js'),
      "path": require.resolve("path-browserify"),
      "os": false,
      "child_process": false,
      "stream": false,
      "util": false,
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
      "assert": false,
      "events": false,
      "net": false,
      "tls": false,
      "zlib": false
    }
  },
  entry: './src/app/app.tsx',
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|ts|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|woff2|woff|ttf|svg|eot)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    historyApiFallback: true,
    compress: false,
    hot: true,
    client: {
      logging: 'info'
    },

    port: 4000
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js',
    publicPath: './' //needs to be "./" for releases
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Arqnet GUI' }),
    new webpack.DefinePlugin({
      '__dirname': '""',
      '__filename': '""',
      'global': 'window'
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  optimization: {
    minimize: false
  },
  node: false
};
