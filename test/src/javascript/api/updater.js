const assert = require('chai').assert

const getLink = require('../../../../src/javascript/api/updater').getLink

describe('getLink function', function () {
  it('Check update link', function () {
       assert.equal(getLink(), 'https://github.com/Graviton-Code-Editor/Graviton-App/releases')
  })
})

