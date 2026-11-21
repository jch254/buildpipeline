import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import * as path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// Link previews: the card a chat app shows for a pasted link. The picture is
// src/og.png, copied to the site root below; its address has to be absolute.
// Production serves the build made for test, so there is one address for both.
const siteUrl = 'https://buildpipeline--prod.603.nz';
const title = 'BuildPipeline | 603.nz';
const description =
  'AWS-powered serverless build, test and deploy pipeline ft. multiple environments';
const imageAlt = '603.nz, BuildPipeline. A scripted build, test and deploy pipeline on AWS.';

const config: webpack.Configuration = {
  mode: 'production',
  entry: [path.join(__dirname, 'src', 'index.tsx')],
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
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'env.js',
          to: 'assets/env.js',
          transform: (content: Buffer, path: string) => {
            return `
            window.env = {
              DEPLOY_ENV: ${JSON.stringify(process.env.DEPLOY_ENV)},
              APP_VERSION: ${JSON.stringify(process.env.APP_VERSION)},
              APP_SECRET: ${JSON.stringify(process.env.APP_SECRET)}
            }
          `;
          },
        },
        { from: path.join(__dirname, 'src', 'og.png'), to: 'og.png' },
      ],
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      title,
      template: path.join(__dirname, 'src', 'index.ejs'),
      favicon: path.join(__dirname, 'src', 'favicon.ico'),
      meta: {
        description,
        'og:type': { property: 'og:type', content: 'website' },
        'og:site_name': { property: 'og:site_name', content: '603.nz' },
        'og:url': { property: 'og:url', content: `${siteUrl}/` },
        'og:title': { property: 'og:title', content: title },
        'og:description': { property: 'og:description', content: description },
        'og:image': { property: 'og:image', content: `${siteUrl}/og.png` },
        'og:image:width': { property: 'og:image:width', content: '1200' },
        'og:image:height': { property: 'og:image:height', content: '630' },
        'og:image:alt': { property: 'og:image:alt', content: imageAlt },
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': `${siteUrl}/og.png`,
      },
      minify: {
        collapseWhitespace: true,
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    chunkIds: 'named',
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
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
          test: (module: any) =>
            module.nameForCondition &&
            /\.css$/.test(module.nameForCondition()) &&
            !/^javascript/.test(module.type),
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
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};

export default config;
