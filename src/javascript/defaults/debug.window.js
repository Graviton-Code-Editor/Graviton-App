import EnvClient from '../constructors/env.client'
const { BrowserWindow } = window.require('electron').remote
const isDev = window.require('electron-is-dev')
const url = window.require('url')
const path = window.require('path')

function openDebugClient() {
	const debugClient = new EnvClient({
		name: 'Debug',
	})
	let debugWindow
	debugClient.on('start', () => {
		debugWindow = new BrowserWindow({
			webPreferences: {
				nativeWindowOpen: true,
				nodeIntegrationInWorker: true,
				nodeIntegration: true,
				webSecurity: true,
			},
			frame: window.process.platform == 'linux',
			minHeight: 320,
			minWidth: 320,
			width: 600,
			height: 600,
			backgroundColor: '#191919',
			title: 'Graviton Editor',
			show: true,
		})
		debugWindow.loadURL(
			url.format({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file:',
				slashes: true,
			})
		)
		debugWindow.emit('something', {
			msg: 'works!',
		})
	})
	debugClient.on('reload', () => {
		debugWindow && debugWindow.reload()
	})
	debugClient.on('stop', () => {
		debugWindow && debugWindow.close()
	})
}

export default openDebugClient
