const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        // CONFIGURACIÓN CSS MODULES
        {
          test: /\.css$/,
          use: [
            'style-loader', // Inyecta estilos al DOM
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true, // Solo habilita módulos para archivos .module.css
                  localIdentName: isProduction
                    ? '[hash:base64]' // Prod: Nombres cortos ofuscados
                    : '[name]__[local]--[hash:base64:5]', // Dev: Nombre legible
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true,
    },
  };
};
