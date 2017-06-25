const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const PurifyCSSPlugin = require('purifycss-webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.argv.indexOf('-p') != -1;
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader'],
          publicPath: '../'
        });
const cssConfig = isProd ? cssProd : cssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './src/app.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      },
      { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
    ],
  },
  devServer:{
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    hot: true,
    port: 9000,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dev Test | Woocom',
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //     include: /\.min\.js$/,
    //     minimize: true
    // }),
    // new UglifyJSPlugin({
    //     compress: true
    // })
  ]
}