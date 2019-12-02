const parseArgs = require('minimist') 
const argv = parseArgs(process.argv.slice(2), {
  boolean: [ 'debug' ],
  string: [ 'port' ]
})
const [ subcommand ] = argv._

const MODE = argv.debug ? "development" : process.env["MODE"] || "production";
const PORT = argv.port ? parseInt(argv.port) : process.env["PORT"] || 3000;

module.exports = {
  subcommand,
  MODE,
  PORT,
  isDev: MODE ==='development',
  isProd: MODE ==='production'
}
