const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

const threads = os.cpus().length;

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './main.js',
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader',           {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        // 其他选项
                      },
                    ],
                  ],
                },
              },
            },],
          },
          {
            test: /\.s[ac]ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader',           {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        // 其他选项
                      },
                    ],
                  ],
                },
              },
            }, 'sass-loader'],
          },
          {
            test: /\.(png|jpe?g|gif|svg|webp)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 8 * 1024,
              },
            },
            generator: {
              filename: 'static/images/[name].[hash:6][ext]',
            },
          },
          {
            test: /\.(woff2?|eot|ttf|otf)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/fonts/[name].[hash:6][ext]',
            },
          },
          {
            test: /\.m?js$/,
            exclude: "node_modules",
            use: [
              {
                loader: 'thread-loader',
                options: {
                  works: threads,
                }
              }
              ,
              {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                plugins: ['@babel/plugin-transform-runtime'],
              },
            }
          ],
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
        ]
      }
    ],
  },
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: threads,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new ESLintPlugin({
      exclude: "node_modules",
      context: path.resolve(__dirname, '../packages'),
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache'),
      threads,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:6].css',
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            'svgo',
            {
              plugins: extendDefaultPlugins([
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),
    new VueLoaderPlugin(),
  ],
}