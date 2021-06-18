const path = require("path");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const formatter = require("react-dev-utils/typescriptFormatter");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const os = require('os')
const PrettyWebpack = require("./pretty-webpack-plugin");
const env = require('./env')

const paths = {
  root: path.resolve('./'),
  public: path.resolve('./public'),
  assets: path.resolve('./public/assets'),
  typescript: require.resolve('typescript', { paths: [path.resolve('./')] }),
  babel_loader_config: require.resolve('./babel.config.js'),
}

const routes = {
  assets: '/assets/'
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
    publicPath: routes.assets,
    filename: "[name].js"
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      useTypescriptIncrementalApi: true,
      silent: true,
      typescript: paths.typescript,
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
    port: env.PORT,
    before: (app) => {
      const history = require('connect-history-api-fallback')
      const { static } = require('express')
      app.use(history())
      app.use('/', static(paths.public))
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
};