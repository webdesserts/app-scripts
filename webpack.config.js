const path = require("path");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const formatter = require("react-dev-utils/typescriptFormatter");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const os = require('os')
const PrettyWebpack = require("./pretty-webpack-plugin");
const env = require('./env')

let paths = {
  root: path.resolve('./'),
  public: path.resolve('./public'),
  assets: path.resolve('./public/assets'),
  typescript: require.resolve('typescript', { paths: [path.resolve('./')] }),
  babel_loader_config: require.resolve('./babel.config.js'),
}

const babel_loader_options = {
  configFile: paths.babel_loader_config
}

module.exports = {
  context: paths.root,
  stats: "none",
  mode: env.MODE,
  devtool: "sourcemaps",
  output: {
    path: paths.assets,
    filename: "[name].js"
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      useTypescriptIncrementalApi: true,
      // TODO: do we need this in combination with babel?
      checkSyntacticErrors: false,
      silent: true,
      typescript: paths.typescript,
      formatter
    }),
    new PrettyWebpack(),
    new CleanWebpackPlugin()
  ],
  devServer: {
    contentBase: false,
    stats: false,
    writeToDisk: env.isProd,
    host: "0.0.0.0",
    public: os.hostname(),
    before: (app) => {
      const { static } = require('express')
      app.use('/', static(paths.public))
    }
  },
  resolve: {
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
            options: { babel: false }
          }
        ]
      }
    ]
  }
};