/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;

module.exports = (env = {}, options = {}) => {
  const shouldBuildStaticSite = env.static === true;
  const isProduction = options.mode === 'production';
  const shouldUseAnalyzer = env.analyzer === true;

  if (shouldBuildStaticSite) {
    console.log('🖥  Building static site');
  }

  if (isProduction) {
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
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    entry: (() => {
      const entries = {
        style: './source/scss/style.scss'
      };
      const clientCommons = [
        'whatwg-fetch',
        './source/js/input-detection-loader'
      ];

      if (shouldBuildStaticSite) {
        entries.client = clientCommons.concat(['./source/static-client.js']);
        entries.server = './source/static-server.js';
      } else {
        entries.client = clientCommons.concat([
          'expose-loader?React!react',
          'expose-loader?ReactDOM!react-dom',
          'expose-loader?Components!./source/app.components.js'
        ]);
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
                minimize: isProduction,
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
      new ManifestPlugin(),
      new SuppressChunksPlugin(
        [
          {
            name: 'style',
            match: /\.js(.map)?$/
          }
        ].concat(shouldBuildStaticSite ? ['server'] : [])
      )
    ]
      .concat(
        // NOTE: This plugin currently makes the codebase crash when recompiling using webpack-dev-server
        isProduction ? [new webpack.optimize.ModuleConcatenationPlugin()] : []
      )
      .concat(
        shouldBuildStaticSite
          ? [
              new StaticSiteGeneratorPlugin({
                entry: 'server',
                locals: {
                  isProduction
                },
                paths: require('./source/static-site/pages/paths')
              }),
              new CopyWebpackPlugin(
                [
                  {
                    from: 'source/static-site/assets',
                    to: 'static-site/assets'
                  },
                  {
                    from: 'source/static-site/api',
                    to: 'static-site/api'
                  }
                ],
                { copyUnmodified: true }
              )
            ]
          : []
      )
      .concat(shouldUseAnalyzer ? [new BundleAnalyzerPlugin()] : []),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: module => {
              if (module.resource && /^.*\.(css|scss)$/.test(module.resource)) {
                return false;
              }

              return module.context && module.context.includes('node_modules');
            },
            chunks: chunk => chunk.name === 'client',
            name: 'vendor'
          }
        }
      }
    }
  };
};
