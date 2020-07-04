import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import * as path from 'path';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';
import * as WebpackChunkHash from 'webpack-chunk-hash';

import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config: webpack.Configuration = {
  mode: 'production',
  entry: [
    path.join(__dirname, 'src', 'index.tsx'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash].js',
    chunkFilename: 'assets/[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
        GA_ID: JSON.stringify(process.env.GA_ID),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'env.js',
        to: 'assets/env.js',
        transform: (content: Buffer, path: string) => {
          return `
            window.env = {
              DEPLOY_ENV: ${JSON.stringify(process.env.DEPLOY_ENV)},
              APP_VERSION: ${JSON.stringify(process.env.APP_VERSION)},
              APP_SECRET: ${JSON.stringify(process.env.APP_SECRET)},
              GA_ID: ${JSON.stringify(process.env.GA_ID)}
            }
          `;
        },
      }],
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new WebpackChunkHash(),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      title: 'BuildPipeline | 603.nz',
      template: path.join(__dirname, 'src', 'index.ejs'),
      favicon: path.join(__dirname, 'src', 'favicon.ico'),
      meta: {
        description: 'AWS-powered serverless build, test and deploy pipeline ft. multiple environments',
      },
      minify: {
        collapseWhitespace: true,
      },
    }),
    new InlineManifestWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    chunkIds: 'named',
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
        canPrint: false,
      }),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: {
            safari10: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      cacheGroups: {
        default: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 20,
        },
        utilities: {
          test: /[\\/]node_modules[\\/](immutable|moment|react|react-dom|react-loading)[\\/]/,
          name: 'utilities',
          priority: 30,
        },
        common: {
          name: 'async-common',
          minChunks: 2,
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        // See: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
        styles: {
          name: 'styles',
          test: module => module.nameForCondition && /\.css$/.test(module.nameForCondition()) && !/^javascript/.test(module.type),
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules'),
        use: {
          loader: 'tslint-loader',
          options: {
            emitErrors: true,
            failOnHint: false,
          },
        },
      },
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        }],
      },
      {
        test: /\.css?$/,
        include: path.join(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        include: path.join(__dirname, 'src'),
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            esModule: false,
          },
        }],
      },
    ],
  },
};

export default config;
