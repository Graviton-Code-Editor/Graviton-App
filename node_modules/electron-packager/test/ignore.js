'use strict'

const common = require('../common')
const fs = require('fs-extra')
const ignore = require('../ignore')
const path = require('path')
const packager = require('..')
const test = require('ava')
const util = require('./_util')

function ignoreTest (t, opts, ignorePattern, ignoredFile) {
  opts.dir = util.fixtureSubdir('basic')
  if (ignorePattern) {
    opts.ignore = ignorePattern
  }

  const targetDir = path.join(t.context.tempDir, 'result')
  ignore.generateIgnores(opts)

  return fs.copy(opts.dir, targetDir, {
    dereference: false,
    filter: ignore.userIgnoreFilter(opts)
  }).then(() => util.assertPathExists(t, path.join(targetDir, 'package.json'), 'The expected output directory should exist and contain files'))
    .then(() => util.assertPathNotExists(t, path.join(targetDir, ignoredFile), `Ignored file '${ignoredFile}' should not exist in copied directory`))
}

function assertOutDirIgnored (t, opts, pathPrefix, existingDirectoryPath, pathToIgnore, ignoredBasenameToCheck) {
  return fs.copy(util.fixtureSubdir('basic'), t.context.workDir, {
    dereference: true,
    stopOnErr: true,
    filter: file => path.basename(file) !== 'node_modules'
  }).then(() => fs.ensureDir(existingDirectoryPath))
    // create file to ensure that directory will be not ignored because it's empty
    .then(() => fs.writeFile(pathToIgnore, '')).then(() => packager(opts))
    .then(() => util.assertPathNotExists(t, path.join(pathPrefix, common.generateFinalBasename(opts), util.generateResourcesPath(opts), 'app', ignoredBasenameToCheck), 'Out dir must not exist in output app directory'))
}

function ignoreOutDirTest (t, opts, distPath) {
  opts.dir = t.context.workDir
  opts.name = 'ignoreOutDirTest'

  // create out dir before packager (real world issue - when second run includes unignored out dir)
  // we don't use path.join here to avoid normalizing
  opts.out = opts.dir + path.sep + distPath

  return assertOutDirIgnored(t, opts, opts.out, opts.out, path.join(opts.out, 'ignoreMe'), path.basename(opts.out))
}

function ignoreImplicitOutDirTest (t, opts) {
  opts.dir = t.context.workDir
  opts.name = 'ignoreImplicitOutDirTest'
  delete opts.out

  const testFilename = 'ignoreMe'
  const previousPackedResultDir = path.join(opts.dir, `${common.sanitizeAppName(opts.name)}-linux-ia32`)

  return assertOutDirIgnored(t, opts, opts.dir, previousPackedResultDir, path.join(previousPackedResultDir, testFilename), testFilename)
}

test('generateIgnores ignores the generated temporary directory only on Linux', t => {
  const tmpdir = '/foo/bar'
  const expected = path.join(tmpdir, 'electron-packager')
  let opts = { tmpdir }

  ignore.generateIgnores(opts)

  if (process.platform === 'linux') {
    t.true(opts.ignore.includes(expected), 'temporary dir in opts.ignore')
  } else {
    t.false(opts.ignore.includes(expected), 'temporary dir not in opts.ignore')
  }
})

test('generateOutIgnores ignores all possible platform/arch permutations', (t) => {
  const ignores = ignore.generateOutIgnores({ name: 'test' })
  t.is(ignores.length, util.allPlatformArchCombosCount)
})

util.testSinglePlatformParallel('ignore default test: .o files', ignoreTest, null, 'ignore.o')
util.testSinglePlatformParallel('ignore default test: .obj files', ignoreTest, null, 'ignore.obj')
util.testSinglePlatformParallel('ignore test: string in array', ignoreTest, ['ignorethis'],
                                'ignorethis.txt')
util.testSinglePlatformParallel('ignore test: string', ignoreTest, 'ignorethis', 'ignorethis.txt')
util.testSinglePlatformParallel('ignore test: RegExp', ignoreTest, /ignorethis/, 'ignorethis.txt')
util.testSinglePlatformParallel('ignore test: Function', ignoreTest,
                                file => file.match(/ignorethis/), 'ignorethis.txt')
util.testSinglePlatformParallel('ignore test: string with slash', ignoreTest, 'ignore/this',
                                path.join('ignore', 'this.txt'))
util.testSinglePlatformParallel('ignore test: only match subfolder of app', ignoreTest,
                                'electron-packager', path.join('electron-packager', 'readme.txt'))
util.testSinglePlatform('ignore out dir test', ignoreOutDirTest, 'ignoredOutDir')
util.testSinglePlatform('ignore out dir test: unnormalized path', ignoreOutDirTest,
                        './ignoredOutDir')
util.testSinglePlatform('ignore out dir test: implicit path', ignoreImplicitOutDirTest)
