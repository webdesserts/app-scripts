const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const formatter = require("react-dev-utils/typescriptFormatter");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const os = require('os')
const PrettyWebpack = require("./pretty-webpack-plugin");
const { getEnv } = require('../env')
const { getProjectPaths, getScriptsPaths } = require('../paths')

/**
 * @typedef {import('webpack').Configuration} WebpackConfiguration
 * 
 * @type {() => WebpackConfiguration & { devServer: any }}
 */
module.exports = () => {
  const projectPaths = getProjectPaths()
  const scriptsPaths = getScriptsPaths()
  const env = getEnv()

  const routes = {
    assets: '/assets/'
  }

  const babel_loader_options = {
    configFile: scriptsPaths.babelConfig
  }


  return {
    context: projectPaths.root,
    stats: "none",
    mode: env.mode,
    devtool: "sourcemaps",
    output: {
      path: projectPaths.assets,
      publicPath: routes.assets,
      filename: "[name].js"
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        async: false,
        useTypescriptIncrementalApi: true,
        silent: true,
        typescript: projectPaths.typescript,
        formatter
      }),
      new PrettyWebpack(),
      new CleanWebpackPlugin()
    ],
    devServer: {
      contentBase: false,
      publicPath: routes.assets,
      stats: false,
      writeToDisk: env.isProd,
      host: "0.0.0.0",
      public: os.hostname(),
      port: env.port,
      before: (app) => {
        const history = require('connect-history-api-fallback')
        const express = require('express')
        app.use(history())
        app.use('/', express.static(projectPaths.webRoot))
      }
    },
    resolve: {
      symlinks: false,
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          loader: require.resolve("babel-loader"),
          options: babel_loader_options
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: babel_loader_options
            },
            {
              loader: require.resolve("@svgr/webpack"),
              options: { babel: false, svgo: false }
            }
          ]
        }
      ]
    }
  }
}