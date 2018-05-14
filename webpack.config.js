const webpack = require('webpack');
const path = require('path');
const PrettyWebpack = require('./pretty-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const chalk = require('chalk')

const PROJECT_ROOT = path.resolve('./')

function customErrorFormatter(error, colors) {
  let position = `${error.line},${error.character}`
  let code = `TS${error.code}:`
  return (`${colors.dim(position)} ${colors.bold(code)} ${error.content}`);
}

module.exports = {
  stats: 'none',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(PROJECT_ROOT, 'app/build/')
  },

  module: {
    rules: [{
      test: /\.jsx?|\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            getCustomTransformers: [createStyledComponentsTransformer()],
            errorFormatter: customErrorFormatter
          }
       }
      ]
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
};