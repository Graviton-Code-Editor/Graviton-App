'use strict'

// Keeping this module because it handles non-buffers gracefully
const bufferEqual = require('buffer-equal')
const common = require('../common')
const config = require('./config.json')
const fs = require('fs-extra')
const packager = require('../index')
const path = require('path')
const plist = require('plist')
const setup = require('./_setup')
const sinon = require('sinon')
const tempy = require('tempy')
const test = require('ava')

const ORIGINAL_CWD = process.cwd()

test.before(t => {
  if (!process.env.CI) {
    return setup.setupTestsuite()
      .then(() => process.chdir(setup.WORK_CWD))
  }
  return Promise.resolve(process.chdir(setup.WORK_CWD))
})

test.after.always(t => {
  process.chdir(ORIGINAL_CWD)
  return fs.remove(setup.WORK_CWD)
})

test.beforeEach(t => {
  t.context.workDir = tempy.directory()
  t.context.tempDir = tempy.directory()
  if (!console.warn.restore) {
    sinon.spy(console, 'warn')
  }
})

test.afterEach.always(t => {
  if (console.warn.restore) {
    console.warn.restore()
  }
  return fs.remove(t.context.workDir)
    .then(() => fs.remove(t.context.tempDir))
})

function testSinglePlatform (name, testFunction, testFunctionArgs, parallel) {
  module.exports.packagerTest(name, (t, opts) => {
    Object.assign(opts, module.exports.singlePlatformOptions())
    return testFunction.apply(null, [t, opts].concat(testFunctionArgs))
  }, parallel)
}

module.exports = {
  allPlatformArchCombosCount: 9,
  assertDirectory: function assertDirectory (t, pathToCheck, message) {
    return fs.stat(pathToCheck)
      .then(stats => t.true(stats.isDirectory(), message))
  },
  assertFile: function assertFile (t, pathToCheck, message) {
    return fs.stat(pathToCheck)
      .then(stats => t.true(stats.isFile(), message))
  },
  assertFilesEqual: function assertFilesEqual (t, file1, file2, message) {
    return Promise.all([fs.readFile(file1), fs.readFile(file2)])
      .then(([buffer1, buffer2]) => bufferEqual(buffer1, buffer2))
      .then(equal => t.true(equal, message))
  },
  assertPathExistsCustom: function assertPathExistsCustom (t, pathToCheck, exists, message) {
    return fs.pathExists(pathToCheck)
      .then(result => t.is(exists, result, message))
  },
  assertPathExists: function assertPathExists (t, pathToCheck, message) {
    return module.exports.assertPathExistsCustom(t, pathToCheck, true, message)
  },
  assertPathNotExists: function assertPathNotExists (t, pathToCheck, message) {
    return module.exports.assertPathExistsCustom(t, pathToCheck, false, message)
  },
  assertSymlink: function assertFile (t, pathToCheck, message) {
    return fs.lstat(pathToCheck)
      .then(stats => t.true(stats.isSymbolicLink(), message))
  },
  assertWarning: function assertWarning (t, message) {
    t.true(console.warn.calledWithExactly(message), `console.warn should be called with: ${message}`)
  },
  fixtureSubdir: setup.fixtureSubdir,
  generateResourcesPath: function generateResourcesPath (opts) {
    return common.isPlatformMac(opts.platform)
      ? path.join(opts.name + '.app', 'Contents', 'Resources')
      : 'resources'
  },
  invalidOptionTest: function invalidOptionTest (opts, err, message) {
    return t => t.throws(packager(opts), err, message)
  },
  packageAndEnsureResourcesPath: function packageAndEnsureResourcesPath (t, opts) {
    let resourcesPath

    return packager(opts)
      .then(paths => {
        resourcesPath = path.join(paths[0], module.exports.generateResourcesPath(opts))
        return module.exports.assertDirectory(t, resourcesPath, 'The output directory should contain the expected resources subdirectory')
      }).then(() => resourcesPath)
  },
  packagerTest: function packagerTest (name, testFunction, parallel) {
    const testDefinition = parallel ? test : test.serial
    testDefinition(name, t => {
      return testFunction(t, {
        name: 'packagerTest',
        out: t.context.workDir,
        tmpdir: t.context.tempDir
      })
    })
  },
  parsePlist: function parsePlist (t, appPath) {
    const plistPath = path.join(appPath, 'Contents', 'Info.plist')

    return module.exports.assertFile(t, plistPath, `The expected Info.plist should exist in ${path.basename(appPath)}`)
      .then(() => fs.readFile(plistPath, 'utf8'))
      .then(file => plist.parse(file))
  },
  singlePlatformOptions: function singlePlatformOptions () {
    return {
      platform: 'linux',
      arch: 'x64',
      electronVersion: config.version
    }
  },
  testSinglePlatform: function (name, testFunction, ...testFunctionArgs) {
    return testSinglePlatform(name, testFunction, testFunctionArgs, false)
  },
  testSinglePlatformParallel: function (name, testFunction, ...testFunctionArgs) {
    return testSinglePlatform(name, testFunction, testFunctionArgs, true)
  },
  verifyPackageExistence: function verifyPackageExistence (finalPaths) {
    return Promise.all(finalPaths.map(finalPath => {
      return fs.stat(finalPath)
        .then(
          stats => stats.isDirectory(),
          () => false
        )
    }))
  }
}
