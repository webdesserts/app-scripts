#!/usr/bin/env node
let webpack = require('webpack')
let config = require('../webpack.config.js')

let compiler = webpack(config)
let watching = null

let [ node, bin, arg ] = process.argv

if (arg === 'build') {
  compiler.run()
}

if (arg === 'start') {
  watching = compiler.watch({}, () => {})
}