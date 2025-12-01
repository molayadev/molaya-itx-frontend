const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
      alias: {
        '@core': path.resolve(__dirname, 'src/core/'),
        '@features': path.resolve(__dirname, 'src/features/')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true, // Habilita CSS Modules solo para archivos .module.css
                  localIdentName: isProduction
                    ? '[hash:base64]'
                    : '[name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new Dotenv() // Inyecta variables del archivo .env a process.env
    ],
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true,
    },
  };
};