const { existsSync } = require('fs')
const { resolve: resolvePath } = require('path')
const { ScriptError: AppError } = require('./utils/errors')
const { indent } = require('./utils/miscellaneous')

/**
 * Tries to resolve a require path according the the project root. If the resolve
 * fails, returns null.
 * @param {string} path
 * @returns {string | null}
 */
function resolveProjectModulePath(path) {
  try {
    return require.resolve(path, { paths: [resolvePath('./')] })
  } catch (err) {
    return null
  }
}

/**
 * Finds and verifies the locations for all project files, folders, and modules needed
 * for app-scripts to run.
 */
function getProjectPaths() {
  const packageConfig = resolvePath('./package.json')
  const tsconfig = resolvePath('./tsconfig.json')
  const typescript = resolveProjectModulePath('typescript')

  if (!existsSync(packageConfig)) {
    throw new AppError(`Unable to find package.json`, [
      `It looks like you're trying to run lib-scripts in an uninitialized project.`,
      `Please make sure you're in the correct directory and one of the following commands first:`,
      ``,
      indent(`yarn init`),
      indent(`npm init`),
    ])
  }

  if (!typescript) {
    throw new AppError(`typescript is not installed`, [
      `app-scripts uses typescript to build your project (even pure js projects).`,
      `Please run one of the following commands to install the latest version:`,
      ``,
      indent(`yarn add --dev typescript`),
      indent(`npm install --save-dev typescript`),
    ])
  }

  if (!existsSync(tsconfig)) {
    throw new AppError(`Unable to find tsconfig.json`, [
      `app-scripts requires a tsconfig.json to properly build.`,
      `Please add a tsconfig.json with the following cotents:`,
      ``,
      indent(`{ "extends": "./node_modules/@webdesserts/app-scripts/app.tsconfig.json" }`),
    ])
  }

  return {
    packageConfig,
    tsconfig,
    typescript,
    root: resolvePath('./'),
    webRoot: resolvePath('./public'),
    assets: resolvePath('./public/assets'),
    source: resolvePath('./src'),
    tests: resolvePath('./src/**/*.test.tsx'),
  }
}

/**
 * Gets the absolute path to configuration files inside app-scripts.
 */
function getScriptsPaths() {
  return {
    babelConfig: require.resolve('./config/babel.config.js'),
    jestConfig: require.resolve('./config/jest.config.js'),
    svgrMock: require.resolve('./mocks/svgrMock.js'),
  }
}

module.exports = { getProjectPaths, getScriptsPaths }