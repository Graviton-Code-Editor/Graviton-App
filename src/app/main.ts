import * as url from 'url'
import * as path from 'path'
import { app, BrowserWindow, protocol } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'

import './plugins_handler'
import MenusHandler from './menus_handler'

let main

app.on('ready', function () {
	protocol.registerFileProtocol('file', (request, callback) => {
		const pathname = request.url.replace('file:///', '')
		callback(pathname)
	})

	let mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600,
	})

	main = new BrowserWindow({
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
			nodeIntegration: true,
			webSecurity: !isDev,
			enableRemoteModule: true,
			scrollBounce: true,
		},
		frame: process.platform !== 'win32',
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
				pathname: path.join(__dirname, '..', '..', 'dist_ui', 'index.html'),
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
