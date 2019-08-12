const parseArgs = require('minimist') 
const argv = parseArgs(process.argv.slice(2), {
  boolean: [ 'debug' ]
})
const [ subcommand ] = argv._

const MODE = argv.debug ? "development" : process.env["MODE"] || "production";

module.exports = {
  subcommand,
  MODE,
  isDev: MODE ==='development',
  isProd: MODE ==='production'
}
