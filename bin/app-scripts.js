#!/usr/bin/env node
const url = require('url')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../webpack.config.js')
const env = require('../env')

const compiler = webpack(config)

const subcommands = {
  help () {
    const label = chalk.bold("USAGE")
    console.info(`${label} app-scripts <command>`)
    console.info(getSubcommandList())
  },

  build (env) {
    compiler.run()

    if (env.isDev) {
      const label = chalk.bold.yellow("WARN")
      console.warn(`${label} you're building your app in development mode, please don't publish this bundle.`)
    }
  },

  dev (env) {
    const express = require('express');
    const middleware = require('webpack-dev-middleware')
    const { devServer: serverConfig } = config
    const listeningUrl = url.format({
      protocol: 'http',
      hostname: serverConfig.public || serverConfig.host,
      port: serverConfig.port,
      pathname: '/'
    })

    const app = express();

    if (serverConfig.before) serverConfig.before(app)
    app.use(middleware(compiler, serverConfig));

    app.listen(serverConfig.port, () => {
      console.log(`Listening at: ${listeningUrl}`);
    });
  },

  watch (env) {
    if (env.isDev) {
      const label = chalk.bold.yellow("WARN")
      console.warn(`${label} you're building your app in development mode, please don't publish this bundle.`)
    }

    compiler.watch({}, () => {})
  }
}

function executeSubcommand(env) {
  const fn = subcommands[env.subcommand]

  if (!env.subcommand) {
    return subcommands.help()
  } else if (fn) {
    const label = chalk.bold("INFO")
    console.info(`${label} Executing app-script "${env.subcommand}"`)
    console.info()
    fn(env)
  } else {
    const label = chalk.bold.red("ERROR")
    console.error(`${label} Unknown app-script named "${env.subcommand}"`)
    console.error(getSubcommandList())
  }
}

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

function indent(string) {
  return `  ${string}`
}

executeSubcommand(env)