const path = require("path");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const formatter = require("react-dev-utils/typescriptFormatter");
const PrettyWebpack = require("./pretty-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const parseArgs = require('minimist') 
const os = require('os')

const argv = parseArgs(process.argv.slice(2), {
  boolean: [ 'debug' ]
})

const MODE = argv.debug ? "development" : process.env["MODE"] || "production";

let paths = {
  root: path.resolve('./'),
  public: path.resolve('./public'),
  build: path.resolve('./build'),
  typescript: require.resolve('typescript', { paths: [path.resolve('./')] }),
  babel_loader_config: require.resolve('./babel.config.js'),
}

const babel_loader_options = {
  configFile: paths.babel_loader_config
}

module.exports = {
  context: paths.root,
  stats: "none",
  mode: MODE,
  devtool: "sourcemaps",
  output: {
    path: paths.build,
    filename: "assets/[name].js"
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
    new CopyPlugin([
      {
        from: paths.public,
        to: paths.build
      }
    ]),
    new CleanWebpackPlugin()
  ],
  devServer: {
    contentBase: false,
    stats: false,
    writeToDisk: MODE === 'production',
    host: "0.0.0.0",
    public: os.hostname()
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  module: {
    rules: [
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
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: babel_loader_options
      }
    ]
  }
};