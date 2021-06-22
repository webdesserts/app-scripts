const { EOL } = require("os")

/**
 * Indents a string. Supports multi-line indentation.
 * 
 * Yes it's stupid simple, but it keeps the indentation consistant.
 * 
 * @param {string} string 
 * @returns {string}
 */
function indent(string) {
  return string
    .split(EOL)
    .map((string) => `  ${string}`)
    .join(EOL);
}

module.exports = { indent }
