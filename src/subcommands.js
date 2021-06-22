const chalk = require("chalk")
const webpack = require("webpack")
const { logger } = require("./logger")
const { indent } = require("./miscellaneous")
const getConfig = require('./webpack.config')

/**
 * @typedef {import("./env").Env} Env
 *
 * @typedef {(env: Env) => Promise<void>} SubCommand
 */

/**
 * @type {{ [key: string]: SubCommand }}
 */
const subcommands = {
  async help () {
    const label = chalk.bold("USAGE")
    logger.info(`${label} app-scripts <command>`)
    logger.info(getSubcommandList())
  },

  async build (env) {
    const config = getConfig()
    const compiler = webpack(config)
    if (env.watch) {
      compiler.watch({}, () => {})
    } else {
      compiler.run(() => {})
    }

    if (env.isDev) {
      const label = chalk.bold.yellow("WARN")
      console.warn(`${label} you're building your app in development mode, please don't publish this bundle.`)
    }
  },

  async dev () {
    const config = getConfig()
    const compiler = webpack(config)
    const express = require('express');
    const middleware = require('webpack-dev-middleware')
    const { devServer: serverConfig } = config
    const hostname = serverConfig.public || serverConfig.host
    const port = serverConfig.port
    const listeningUrl = new URL(`http://${hostname}:${port}/`)

    compiler.hooks.done.tap('compiling notice', (stats) => {
      if (!stats.hasErrors()) {
        console.log(`Listening at ${chalk.magenta(listeningUrl)}`);
        console.log('')
      }
    })

    const app = express();

    if (serverConfig.before) serverConfig.before(app)
    app.use(middleware(compiler, serverConfig));

    const devServer = app.listen(port);

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  }
}

/**
 * @returns {string}
 */
function getSubcommandList() {
  let lines = []

  lines.push(``)
  lines.push(chalk.dim(`Commands:`))
  lines.push(``)
  let commands = Object.keys(subcommands).map(key => `${key}`).map(indent)
  lines = lines.concat(commands)
  lines.push(``)

  return lines.map(indent).join(`\n`)
}

module.exports = { subcommands, getSubcommandList }