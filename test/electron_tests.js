/*
 * Tests for Graviton in Electron (desktop app) mode
 */

const { remote } = require('electron')
const { RunningConfig, StaticConfig, Dialog, Window, puffin, Notification } = window.test
const { expect } = require('chai')
const { element } = require('@mkenzo_8/puffin')
const fs = require('fs-extra')

console.log(`
  Running with: \n
   NODE_ENV -> ${process.env.NODE_ENV}\n
   MENUBAR -> ${process.env.MENUBAR}\n
`)

describe('Main process', function () {
	it('Window opens', function () {
		return remote.getCurrentWindow()
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
				component() {
					return puffin.element`<p>Hello Word</p>`
				},
			})
			cached_win.launch()

			const windowElement = cached_win.WindowElement
			const windowHTML = windowElement.innerHTML

			expect(windowHTML).to.include('<p>Hello Word</p>')

			return windowElement
		})
		it('With [component, height, width, minHeight, minWidth] ', function () {
			cached_win = new Window({
				height: '200px',
				width: '250px',
				minHeight: '200px',
				minWidth: '250px',
				component() {
					return puffin.element`<p>Hello Word</p>`
				},
			})
			cached_win.launch()

			const windowElement = cached_win.WindowElement.children[1]
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
				content: 'Hello Earth',
			})
			cached_dialog.launch()

			const dialogElement = cached_dialog.WindowInstance.WindowElement
			const dialogHTML = dialogElement.innerHTML

			expect(dialogHTML).to.include('Hello Earth')

			return dialogElement
		})
	})
	describe('Notification', function () {
		it('With [title, content]', function () {
			const { NotificationElement } = new Notification({
				title: 'Title',
				content: 'And content',
			})
			const notificationHTML = NotificationElement.innerHTML
			expect(notificationHTML).to.include('Title')
			expect(notificationHTML).to.include('And content')

			return NotificationElement
		})
		it('With [title, content, buttons]', function () {
			let test1
			const { NotificationElement } = new Notification({
				title: 'Title',
				content: 'And content',
				buttons: [
					{
						label: 'Button 1',
						action() {
							test1 = true
						},
					},
				],
			})
			const notificationButton = NotificationElement.getElementsByTagName('BUTTON')[0]
			expect(notificationButton.innerText).to.be.equal('BUTTON 1')
			notificationButton.click()
			expect(test1).equal(true)

			return NotificationElement
		})
		it('With [title, component]', function () {
			const { NotificationElement } = new Notification({
				title: 'Title',
				component() {
					return element`<span class="span">TEST</span>`
				},
			})
			const notificationSpan = NotificationElement.getElementsByClassName('span')[0]
			expect(notificationSpan.innerText).to.be.equal('TEST')
			return NotificationElement
		})
	})
	describe('FileSystem', function () {
		it('Open a file', function (done) {
			const sampleFile = __filename
			const { focusedTab } = RunningConfig.data

			RunningConfig.on('aTabHasBeenFocused').then(async () => {
				const focusedTabDirectory = RunningConfig.data.focusedTab.state.data.directory
				// Expect the same directory
				expect(focusedTabDirectory).equal(sampleFile)

				const { client, instance } = RunningConfig.data.focusedEditor
				const fileData = await fs.readFile(__filename, 'UTF-8')
				const editorData = client.do('getValue', instance)

				// Expect the same file's value
				expect(fileData).equal(editorData)

				done()
			})

			RunningConfig.emit('loadFile', {
				filePath: sampleFile,
			})
		})
		it('Open a folder', function (done) {
			const sampleFolder = __dirname
			const { focusedTab } = RunningConfig.data
			const explorerPanel = document.getElementById('explorer_panel')

			RunningConfig.emit('addFolderToRunningWorkspace', {
				folderPath: sampleFolder,
			})

			setTimeout(() => {
				const { fullpath } = explorerPanel.children[1].props
				// Expect the same directory as we previously defined
				expect(fullpath).equal(sampleFolder)
				done()
			}, 500)
		})
	})
})
