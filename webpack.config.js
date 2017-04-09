var path = require('path');
var webpack = require('webpack');
var NODE_MODULES_PATH = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/client'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
      __CLIENT__: JSON.stringify(true),
      __SERVER__: JSON.stringify(false),
      __TARGET__: JSON.stringify('browser'),
    }),
  ],
  resolve: {
    alias: {
      mobx: path.resolve(__dirname, '../mobx/src/mobx.ts'),
      'mobx-react': path.resolve(__dirname, '../mobx-react/src')
    },
    extensions: ['.js', '.jsx', '.ts']
  },
  externals: {
    'react-native': {
      root: 'ReactNative',
      commonjs: 'react-native',
      commonjs2: 'react-native',
      amd: 'react-native'
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'ts-loader',
      }
    ],
  },
};
