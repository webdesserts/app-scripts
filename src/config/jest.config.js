
const { getProjectPaths, getScriptsPaths } = require('../paths')
const paths = getProjectPaths()
const scriptsPaths = getScriptsPaths()

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  "transform": {
    '\\.(js|ts)x?$': [ 'babel-jest', { configFile: scriptsPaths.babelConfig} ]
  },

  moduleNameMapper: {
    '\\.svg$': scriptsPaths.svgrMock,
  },

  // setupFiles: [
  //   "./setupJest.js"
  // ],

  // Automatically restore mock state between every test
  restoreMocks: true,

  // The root directory that Jest should scan for tests and modules within
  rootDir: paths.source,

  // The test environment that will be used for testing
  testEnvironment: "jsdom",
};
