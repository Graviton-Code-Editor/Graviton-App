'use strict'

const packager = require('..')
const path = require('path')
const util = require('./_util')

if (!(process.env.CI && process.platform === 'win32')) {
  const masOpts = {
    name: 'masTest',
    dir: util.fixtureSubdir('basic'),
    electronVersion: '2.0.0-beta.1',
    arch: 'x64',
    platform: 'mas'
  }

  util.packagerTest('warn if building for mas and not signing', (t, baseOpts) => {
    const warningLog = console.warn
    let output = ''
    console.warn = message => { output += message }

    const finalize = err => {
      console.warn = warningLog
      if (err) throw err
    }

    return packager(Object.assign({}, baseOpts, masOpts))
      .then(() =>
        t.truthy(output.match(/signing is required for mas builds/), 'the correct warning is emitted')
      ).then(finalize)
      .catch(finalize)
  })

  util.packagerTest('update Login Helper if it exists', (t, baseOpts) => {
    let helperPath
    let contentsPath
    const helperName = `${masOpts.name} Login Helper`
    return packager(Object.assign({}, baseOpts, masOpts))
      .then(paths => {
        helperPath = path.join(paths[0], `${masOpts.name}.app`, 'Contents', 'Library', 'LoginItems', `${helperName}.app`)
        contentsPath = path.join(helperPath, 'Contents')
        return util.assertPathExists(t, helperPath, 'renamed Login Helper app exists')
      }).then(() => util.parsePlist(t, helperPath))
      .then(plistData => {
        t.is(plistData.CFBundleExecutable, helperName, 'CFBundleExecutable is renamed Login Helper')
        t.is(plistData.CFBundleName, helperName, 'CFBundleName is renamed Login Helper')
        t.is(plistData.CFBundleIdentifier, 'com.electron.mastest.loginhelper')
        return util.assertPathExists(t, path.join(contentsPath, 'MacOS', helperName), 'renamed Login Helper executable exists')
      })
  })
}
