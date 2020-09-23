import EnvClient from '../constructors/env.client'
const { BrowserWindow } = window.require('electron').remote
import isDev from 'electron-is-dev'
const url = window.require('url')
const path = window.require('path')

function openDebugClient() {
	const debugClient = new EnvClient({
		name: 'Debug Window',
	})
	let debugWindow
	debugClient.on('start', () => {
		debugWindow = new BrowserWindow({
			webPreferences: {
				nativeWindowOpen: true,
				nodeIntegrationInWorker: true,
				nodeIntegration: true,
				webSecurity: false,
				enableRemoteModule: true,
				additionalArguments: ['--mode', 'debug'],
			},
			frame: process.platform !== 'win32',
			minHeight: 320,
			minWidth: 320,
			width: 600,
			height: 600,
			backgroundColor: '#191919',
			title: 'Graviton Editor',
			show: true,
		})
		if (isDev) {
			debugWindow.loadURL('http://localhost:9000')
		} else {
			debugWindow.loadURL(
				url.format({
					pathname: path.join(process.resourcesPath, 'app.asar', 'dist_ui', 'index.html'),
					protocol: 'file:',
					slashes: true,
				}),
			)
		}
	})
	debugClient.on('reload', () => {
		debugWindow && debugWindow.reload()
	})
	debugClient.on('stop', () => {
		try {
			debugWindow && debugWindow.close()
		} catch {
			return
		}
	})
}

export default openDebugClient
