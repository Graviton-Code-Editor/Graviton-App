'use strict'

const execSync = require('child_process').execSync

module.exports = {
  host: function host (quiet) {
    const arch = process.arch
    if (arch === 'arm') {
      switch (process.config.variables.arm_version) {
        case '6':
          return module.exports.uname()
        case '7':
          return 'armv7l'
        default:
          if (!quiet) {
            console.warn(`WARNING: Could not determine specific ARM arch. Detected ARM version: ${JSON.stringify(process.config.variables.arm_version)}`)
          }
      }
    }

    return arch
  },

  /**
   * Returns the arch name from the `uname` utility.
   */
  uname: function uname () {
    return execSync('uname -m').toString().trim()
  }
}
