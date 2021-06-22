const parseArgs = require("minimist");

/**
 * @typedef {'development' | 'production'} Mode
 */
const MODES = ["development", "production"];

/**
 * @param {string | undefined} value
 * @returns {value is Mode}
 */
function isMode(value) {
  return typeof value === "string" && MODES.includes(value);
}

/**
 * @typedef {{
 *   subcommand?: string,
 *   mode: Mode,
 *   port: number,
 *   watch: boolean,
 *   isDev: boolean,
 *   isProd: boolean
 * }} Env
 */

/**
 * @returns {Env}
 */
function getEnv() {
  const argv = parseArgs(process.argv.slice(2), {
    boolean: [ 'debug', 'watch' ],
    string: [ 'port' ]
  });
  const [subcommand] = argv._;
  const mode = getMode(argv.debug);
  const port = getPort(argv.port);

  return {
    subcommand,
    mode,
    port,
    watch: argv.watch,
    isDev: mode === "development",
    isProd: mode === "production",
  };
}

/**
 * @param {boolean} debug
 * @returns {Mode}
 */
function getMode(debug) {
  if (debug) return "development";

  const mode = process.env["MODE"];

  if (isMode(mode)) {
    return mode;
  } else {
    return "production";
  }
}

/**
 * @param {string | undefined} portArg
 * @returns {number}
 */
function getPort(portArg) {
  if (portArg) {
    return parseInt(portArg)
  }

  const port = process.env['PORT']

  if (port) {
    return parseInt(port)
  }

  return 3000
}


module.exports = { getEnv };
