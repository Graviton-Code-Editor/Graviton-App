/*
 * Tests for Graviton in Browser mode
 */

const { RunningConfig } = window.test

describe('App', function () {
	it('App opened correctly', function (done) {
		RunningConfig.once('appLoaded', () => done())
	})
})
