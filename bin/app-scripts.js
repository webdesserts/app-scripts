#!/usr/bin/env node
let webpack = require('webpack')
let config = require('../webpack.config.js')

let compiler = webpack(config)

let [ node, bin, arg ] = process.argv

if (arg === 'build') {
  compiler.run()
}

if (arg === 'start') {
  const express = require('express');
  const middleware = require('webpack-dev-middleware')
  const history = require('connect-history-api-fallback')

  const app = express();

  app.use(history())
  app.use(middleware(compiler, config.devServer));

  app.listen(3000);
}

if (arg === 'watch') {
  compiler.watch({}, () => {})
}