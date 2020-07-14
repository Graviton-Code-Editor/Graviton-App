const url = require('url')
const path = require('path')
const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const windowStateKeeper = require('electron-window-state')
const AdmZip = require('adm-zip')
const appData = require('appdata-path')
const fs = require('fs-extra')
const axios = require('axios')
const { ipcMain } = require('electron')

let main

app.on('ready', function () {
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
		scrollBounce: true,
	})
	if (!isDev) main.removeMenu()
	mainWindowState.manage(main)
	if (isDev) {
		main.loadURL(
			url.format({
				pathname: path.join(__dirname, 'dist_parcel', 'index.html'),
				protocol: 'file:',
				slashes: true,
			})
		)
		main.webContents.openDevTools()
		main.argv = process.argv.splice(4)
	} else {
		main.loadURL(
			url.format({
				pathname: path.join(__dirname, 'dist_parcel', 'index.html'),
				protocol: 'file:',
				slashes: true,
			})
		)
		main.argv = process.argv.splice(1)
	}
	main.isDebug = false
	main.on('ready-to-show', () => {
		mainWindowState.manage(main)
		main.show()
		main.focus()
	})
	if (path.basename(__dirname) === 'Graviton-App') {
		main.setMenuBarVisibility(true)
	} else {
		main.setMenuBarVisibility(false)
	}
})

function getAppIcon() {
	switch (process.platform) {
		case 'win32':
			return path.join(__dirname, 'assets', 'building', 'win32', 'logo.ico')
		case 'linux':
			return path.join(__dirname, 'assets', 'building', 'linux', '512x512.png')
		case 'darwin':
			return path.join(__dirname, 'assets', 'building', 'darwin', 'icon.png')
	}
}

app.on('window-all-closed', () => {
	app.quit()
})

app.on('before-quit', () => {
	app.removeAllListeners('close')
})

ipcMain.on('download-plugin', (event, { url, id, dist }) => {
	getZip(url, id, dist)
		.then(() => {
			event.reply('plugin-installed', true)
		})
		.catch(err => console.log(err))
})

function getZip(url, pluginId, dist) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url,
			responseType: 'stream',
		}).then(async response => {
			const zipPath = path.join(dist, `${pluginId}.zip`)
			response.data.pipe(fs.createWriteStream(zipPath)).on('close', (a, b) => {
				//Finished download the plugins's zip
				createPluginFolder(pluginId, dist)
				extractZip(zipPath, pluginId, dist)
					.then(() => {
						//Finished unzipping the plugin
						resolve()
					})
					.catch(err => console.log(err))
			})
		})
	})
}

function createPluginFolder(pluginId, dist) {
	const pluginDirectory = path.join(dist, pluginId)
	if (!fs.existsSync(pluginDirectory)) {
		fs.mkdirSync(pluginDirectory)
	}
}

function extractZip(zipPath, pluginId, dist) {
	const pluginDirectory = path.join(dist, pluginId)
	return new Promise((resolve, reject) => {
		const zip = new AdmZip(zipPath)
		zip.extractAllTo(pluginDirectory, true)
		resolve()
	})
}
app.commandLine.appendSwitch('disable-smooth-scrolling', 'true')
