const { remote } = require('electron')
const { RunningConfig, StaticConfig, Dialog, Window, puffin } = window.test
const { expect } = require('chai')

describe('Main process', function () {
	it('Window opens', function () {
		return remote.getCurrentWindow() !== undefined ? true : false
	})
})

describe('Renderer process', function () {
	it('RunningConfig exists', function () {
		return RunningConfig !== undefined
	})
	it('StaticConfig exists', function () {
		return StaticConfig !== undefined
	})
	it('UI started', async () => {
		return await RunningConfig.on('test.bootedUp')
	})
})

describe('Constructors', function () {
	describe('Window', function () {
		let cached_win
		afterEach(function () {
			cached_win.close()
		})
		it('With [component] ', function () {
			cached_win = new Window({
				id: 'test_window',
				component() {
					return puffin.element`<p>Hello Word</p>`
				},
			})
			cached_win.launch()

			const windowElement = document.getElementById('test_window')
			const windowHTML = windowElement.innerHTML

			expect(windowHTML).to.include('<p>Hello Word</p>')

			return windowElement
		})
		it('With [component, height, width, minHeight, minWidth] ', function () {
			cached_win = new Window({
				id: 'test_window',
				height: '200px',
				width: '250px',
				minHeight: '200px',
				minWidth: '250px',
				component() {
					return puffin.element`<p>Hello Word</p>`
				},
			})
			cached_win.launch()

			const windowElement = document.getElementById('test_window').children[1]
			const { clientWidth, clientHeight } = windowElement

			expect(clientWidth).to.equal(250)
			expect(clientHeight).to.equal(200)

			return windowElement
		})
	})
	describe('Dialog', function () {
		let cached_dialog
		afterEach(function () {
			cached_dialog.close()
		})
		it('With [content] ', function () {
			cached_dialog = new Dialog({
				id: 'test_dialog',
				content: 'Hello Earth',
			})
			cached_dialog.launch()

			const dialogElement = document.getElementById('test_dialog')
			const dialogHTML = dialogElement.innerHTML

			expect(dialogHTML).to.include('Hello Earth')

			return dialogElement
		})
	})
})
