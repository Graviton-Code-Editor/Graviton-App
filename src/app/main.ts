import * as url from 'url'
import * as path from 'path'
import { app, BrowserWindow, protocol } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'
import hasAnyValidArgument from './cli'
import Store from './store_handler'
import WindowHandler from './window_handler'
import MenusHandler from './menus_handler'
import TerminalHandler from './terminal_handler'
import './plugins_handler'
import './debug_window'

app.whenReady().then(() => {
	const anyValidArgument = hasAnyValidArgument()
	if (anyValidArgument) {
		process.exit(0)
	} else {
		createWindow()
	}
})

function createWindow() {
	protocol.registerFileProtocol('file', (request, callback) => {
		const pathname = request.url.replace('file:///', '')
		callback(pathname)
	})

	const mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600,
	})

	const windowID = Math.random()

	const OS = (Store.get('config') as any).appPlatform
	const isWindows = OS === 'win32' || (OS === 'auto' && process.platform === 'win32')

	const window = new BrowserWindow({
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

	mainWindowState.manage(window)

	if (isDev) {
		window.loadURL('http://localhost:9000')
		window.webContents.openDevTools()
	} else {
		window.removeMenu()
		window.loadURL(
			url.format({
				pathname: path.join(__dirname, '..', 'dist_ui', 'index.html'),
				protocol: 'file:',
				slashes: true,
			}),
		)
	}

	window.on('ready-to-show', () => {
		window.show()
		window.focus()
	})

	if (path.basename(path.join(__dirname, '..')) === 'Graviton-App') {
		window.setMenuBarVisibility(true)
	} else {
		window.setMenuBarVisibility(false)
	}

	;(window as any).windowID = windowID

	WindowHandler(window)
	MenusHandler(window)
	TerminalHandler(window)
}

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

// Set Graviton as handler for protocol "graviton"
app.setAsDefaultProtocolClient('graviton')
// Disable chromium's smoot scrolling
app.commandLine.appendSwitch('disable-smooth-scrolling', 'true')
