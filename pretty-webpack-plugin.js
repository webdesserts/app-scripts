'use strict'

let chalk = require('chalk')
let table = require('text-table')
let filesize = require('filesize')
let stripAnsi = require('strip-ansi')
let formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

module.exports = class PrettyWebpack {
  constructor(userOptions) {
    let defaultOptions = {
      port: 3001,
      clear: true,
    }

    this.options = Object.assign({}, defaultOptions, userOptions)
  }

  assetsToTable (assets) {
    let data = [[ chalk.bold('Assets'), chalk.bold('Size') ]]

    assets.forEach((asset) => {
      let isWebpackAsset = /(hot-update|webpack-stats)/.test(asset.name)
      if (!isWebpackAsset) data.push([ chalk.cyan(asset.name), filesize(asset.size) ])
    })

    return table(data, { align: [ 'l', 'r' ], stringLength: function (str) {
      return stripAnsi(str).length
    } })
  }

  clearConsole() {
    console.log(' ')
    if (this.options.clear) process.stdout.write('\x1bc');
  }

  apply(compiler) {
    compiler.hooks.compile.tap({ name: 'compiling notice' }, () => {
      this.clearConsole();
      console.log(chalk.cyan.inverse(' Compiling... '))
    });

    compiler.hooks.done.tap({ name: 'completion notice' }, (stats) => {
      this.clearConsole();
      let hasErrors = stats.hasErrors();
      let hasWarnings = stats.hasWarnings();
      let json = stats.toJson({}, true)
      let messages = formatWebpackMessages(json)

      /* Titles */

      if (!hasErrors && !hasWarnings) {
        console.log(chalk.green.inverse(' Compiled '));
        console.log()
      } else if (hasErrors) {
        console.log(chalk.red.inverse(' Compile Failed '));
        console.log();
      } else if (hasWarnings) {
        console.log(chalk.yellow.inverse(' Compiled '));
        console.log()
      }

      /* Assets */

      if (!hasErrors) {
        let date = new Date(Date.now())
        let hours = date.getHours()
        let now = `${hours % 12 || 12}:${date.getMinutes()}:${date.getSeconds()} ${hours > 12 ? 'PM' : 'AM'}`
        console.log(this.assetsToTable(json.assets))
        console.log()
        console.log('Completed in', chalk.magenta(json.time / 1000 + 's'), '@', chalk.magenta(now))
        console.log();
      }

      /* Errors */

      if (hasErrors) {
        messages.errors.forEach(message => {
          let label = chalk.red.bold.underline('ERROR')
          console.log(`${label} ${message}`);
          console.log();
        });

        // If errors exist, ignore warnings
        return;
      }

      /* Warnings */

      if (hasWarnings) {
        messages.errors.forEach(message => {
          let label = chalk.yellow.bold.underline('WARN')
          console.log(`${label} ${message}`);
          console.log();
        });
      }

      return;
    });
  }
}
