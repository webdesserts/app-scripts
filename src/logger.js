const chalk = require('chalk')
const { EOL } = require('os')
const { ScriptError } = require('./errors')
const { indent } = require('./miscellaneous')

const logger = {
  /**
   * Logs the message.
   * 
   * Should only be used for the actual "result" of the cli command.
   * 
   * @param  {...any} message 
   */
  log (...message) {
    console.log(...message)
  },

  /**
   * Like log but prints to stderr so it can be filtered out from command results
   * 
   * @param {any[]} message
   */
  info (...message) {
    console.error(...message)
  },

  /**
   * Labels the message as a warning and prints to stderr
   * 
   * @param {any[]} message
   */
  warn (...message) {
    const label = chalk.bold.yellow("WARN")
    console.error(`${label}`, ...message)
  },

  /**
   * Labels the message as a error and prints to stderr
   * 
   * @param {string[] | [Error]} messages
   */
  error (...messages) {
    const label = chalk.bold.red("ERROR")
    
    if (messages[0] instanceof ScriptError) {
      const error = messages[0]
      console.error(`${label}`, error.message)
      if (error.details) {
        this.info(chalk.dim(error.details.split(EOL).map(indent).join(EOL)));
        this.info('')
      }
    }
    
    else if (messages[0] instanceof Error) {
      const error = messages[0]
      console.error(`${label}`, error.message)
      if (error.stack) {
        this.info(chalk.dim(error.stack));
      }
    }
    
    else {
      console.error(`${label}`, ...messages)
    }
  },
}

module.exports = {
  logger,
}