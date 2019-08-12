#!/usr/bin/env node
const webpack = require('webpack')
const chalk = require('chalk')
const config = require('../webpack.config.js')
const env = require('../env')

const compiler = webpack(config)

if (env.subcommand === 'build') {
  compiler.run()
  if (env.isDev) {
    const label = chalk.bold.yellow("WARN")
    console.warn(`${label} you're building your app in development mode, please don't publish this bundle.`)
  }
}

if (env.subcommand === 'start') {
  const express = require('express');
  const middleware = require('webpack-dev-middleware')
  const history = require('connect-history-api-fallback')

  const app = express();

  app.use(middleware(compiler, config.devServer));
  app.use(history())

  app.listen(3000);
}

if (env.subcommand === 'watch') {
  if (env.isDev) {
    const label = chalk.bold.yellow("WARN")
    console.warn(`${label} you're building your app in development mode, please don't publish this bundle.`)
  }
  compiler.watch({}, () => {})
}