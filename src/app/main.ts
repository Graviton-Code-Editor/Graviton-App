import * as url from 'url'
import * as path from 'path'
import { app, BrowserWindow, protocol } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'

import './plugins_handler'
import Store from './store_handler'
import './debug_window'
import WindowHandler from './window'
import MenusHandler from './menus_handler'

let main

app.setAsDefaultProtocolClient('graviton')

app.on('ready', function () {
	protocol.registerFileProtocol('file', (request, callback) => {
		const pathname = request.url.replace('file:///', '')
		callback(pathname)
	})

	let mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600,
	})

	const windowID = Math.random()

	const OS = (Store.get('config') as any).appPlatform
	const isWindows = OS === 'win32' || (OS === 'auto' && process.platform === 'win32')

	main = new BrowserWindow({
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
			nodeIntegration: true,
			webSecurity: !isDev,
			enableRemoteModule: false,
			scrollBounce: true,
			preload: path.join(__dirname, 'preload.js'),
			additionalArguments: ['--windowID', windowID.toString()],
		},
		frame: !isWindows,
		minHeight: 320,
		minWidth: 320,
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#191919',
		title: 'Graviton Editor',
		show: false,
		icon: getAppIcon(),
	})

	mainWindowState.manage(main)
	if (isDev) {
		main.loadURL('http://localhost:9000')
		main.webContents.openDevTools()
	} else {
		main.removeMenu()
		main.loadURL(
			url.format({
				pathname: path.join(__dirname, '..', 'dist_ui', 'index.html'),
				protocol: 'file:',
				slashes: true,
			}),
		)
	}

	main.on('ready-to-show', () => {
		mainWindowState.manage(main)
		main.show()
		main.focus()
	})
	if (path.basename(path.join(__dirname, '..')) === 'Graviton-App') {
		main.setMenuBarVisibility(true)
	} else {
		main.setMenuBarVisibility(false)
	}

	main.windowID = windowID

	WindowHandler(main)
	MenusHandler(main)
})

function getAppIcon() {
	switch (process.platform) {
		case 'win32':
			return path.join(__dirname, '..', 'assets', 'building', 'win32', 'logo.ico')
		case 'linux':
			return path.join(__dirname, '..', 'assets', 'building', 'linux', '512x512.png')
		case 'darwin':
			return path.join(__dirname, '..', 'assets', 'building', 'darwin', 'icon.png')
	}
}

app.on('window-all-closed', () => {
	app.quit()
})

app.on('before-quit', () => {
	app.removeAllListeners('close')
})

app.commandLine.appendSwitch('disable-smooth-scrolling', 'true')
app.allowRendererProcessReuse = false
