/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { readdirSync, statSync } = require('fs');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;

const mockupFolder = './source/mockup/pages/';
const mockupPaths = readdirSync(mockupFolder)
  .filter(name => statSync(mockupFolder + name).isDirectory())
  .map(name => '/' + name)
  .concat('/');

module.exports = (env = {}, options = {}) => {
  const shouldBuildStaticSite = env.static === true;
  const shouldMinify = options.mode === 'production';
  const shouldUseAnalyzer = env.analyzer === true;

  if (shouldBuildStaticSite) {
    console.log('🖥  Building static site');
  }

  if (shouldMinify) {
    console.log('📦  Minifying code');
  }

  if (shouldUseAnalyzer) {
    console.log('🕵🏻  Starting bundle analyzer');
  }

  return {
    devServer: {
      disableHostCheck: true,
      inline: false,
      stats: 'minimal'
    },
    devtool: shouldMinify ? 'source-map' : 'cheap-module-eval-source-map',
    entry: (() => {
      const entries = {
        style: './source/scss/style.scss'
      };

      // NOTE: when using mockup with 'yarn dev', only static.js will be served
      if (shouldBuildStaticSite) {
        entries.static = [
          'babel-polyfill',
          'whatwg-fetch',
          './source/static.js'
        ];
      } else {
        entries.client = [
          'babel-polyfill',
          'whatwg-fetch',
          './source/js/input-detection-loader',
          'expose-loader?React!react',
          'expose-loader?ReactDOM!react-dom',
          'expose-loader?Components!./source/app.components.js'
        ];
        entries.server = [
          './source/js/server-polyfills.js',
          'expose-loader?React!react',
          'expose-loader?ReactDOM!react-dom',
          'expose-loader?ReactDOMServer!react-dom/server',
          'expose-loader?Components!./source/app.components.js'
        ];
      }

      return entries;
    })(),
    output: (() => {
      const output = {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
      };

      if (shouldBuildStaticSite) {
        output.libraryTarget = 'umd';
        output.globalObject = 'this';
      }

      return output;
    })(),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader']
        },
        {
          enforce: 'pre',
          test: /\.scss$/,
          exclude: /node_modules/,
          use: 'import-glob'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: shouldMinify,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: { plugins: [autoprefixer], sourceMap: true }
            },
            { loader: 'resolve-url-loader' },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ])
        },
        {
          test: /\.(svg|png|jpg|woff2?|ttf|eot)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.scss'],
      alias: {
        components: path.resolve(__dirname, 'source/components'),
        js: path.resolve(__dirname, 'source/js')
      }
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new LodashModuleReplacementPlugin({
        paths: true
      }),
      new ManifestPlugin(),
      new SuppressChunksPlugin([
        {
          name: 'style',
          match: /\.js(.map)?$/
        }
      ])
    ]
      .concat(
        // NOTE: When https://github.com/markdalgleish/static-site-generator-webpack-plugin/pull/115 is accepted and published we can enable chunking at the same time as static site building.
        shouldBuildStaticSite
          ? [
              new StaticSiteGeneratorPlugin({
                entry: 'static',
                paths: mockupPaths
              }),
              new CopyWebpackPlugin(
                [
                  { from: 'source/mockup/assets', to: 'mockup/assets' },
                  { from: 'source/mockup/api', to: 'mockup/api' }
                ],
                { copyUnmodified: true }
              )
            ]
          : [new webpack.optimize.ModuleConcatenationPlugin()]
      )
      .concat(shouldUseAnalyzer ? [new BundleAnalyzerPlugin()] : []),
    optimization: shouldBuildStaticSite
      ? undefined
      : {
          splitChunks: {
            cacheGroups: {
              commons: {
                test: module => {
                  if (
                    module.resource &&
                    /^.*\.(css|scss)$/.test(module.resource)
                  ) {
                    return false;
                  }

                  return (
                    module.context && module.context.includes('node_modules')
                  );
                },
                chunks: chunk => chunk.name === 'client',
                name: 'vendor'
              }
            }
          }
        }
  };
};
