const { getEnv } = require("./env")
const { logger } = require("./logger")
const { subcommands, getSubcommandList } = require("./subcommands")

/**
 * The entry point for the app scripts cli
 * 
 * @returns {Promise<void>}
 */
async function run() {
  const env = getEnv()

  if (!env.subcommand) {
    return subcommands.help(env)
  }

  const fn = subcommands[env.subcommand]

  if (!fn) {
    logger.error(`Unknown app-script named "${env.subcommand}"`)
    logger.info(getSubcommandList())
    process.exit(1)
  }

  logger.info(`Executing app-script "${env.subcommand}"`)
  logger.info()

  try {
    await fn(env)
  } catch(err) {
    logger.error(err)
    process.exit(1)
  }
}

module.exports = { run }