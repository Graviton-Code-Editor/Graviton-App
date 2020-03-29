const url = require("url")
const path = require("path")
const { app, BrowserWindow } = require("electron")
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');
const zip  =require( 'extract-zip');
const appData = require( 'appdata-path');
const fs = require( 'fs');
const axios = require( 'axios');
const { ipcMain } = require('electron')

const PLUGINS_DIR = path.join(appData(),'.graviton2','plugins')

let main 

app.on("ready", function() {
	
	let mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	main = new BrowserWindow({
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
			nodeIntegration: true,
			webSecurity:!isDev
		},
		frame: process.platform == "linux",
		minHeight: 320,
		minWidth: 320,
		x:mainWindowState.x,
		y:mainWindowState.y,
		width:mainWindowState.width,
		height:mainWindowState.height,
		backgroundColor: "#191919",
		title: "Graviton Editor",
		show:false,
		icon:path.join(__dirname,"assets", "building",process.platform,"icon.ico")
	})
	if( !isDev ) main.removeMenu()
	mainWindowState.manage(main);
	if (isDev) {
		main.loadURL("http://localhost:4321/")
		main.webContents.openDevTools();
		main.argv = process.argv.splice(4)
	} else {
		main.loadURL(
			url.format({
				pathname: path.join(__dirname,"dist_parcel", "index.html"),
				protocol: "file:",
				slashes: true
			})
		)
		main.argv = process.argv.splice(1)

	}
	main.on("ready-to-show", () => {
		mainWindowState.manage(main);
		main.show()
		main.focus()
	})
	if (
		path.basename(__dirname) === "Graviton-App"
	) {
		main.setMenuBarVisibility(true)
	} else {
		main.setMenuBarVisibility(false)
	}
})

app.on("window-all-closed", () => {
	app.quit()
})

app.on("before-quit", () => {
	app.removeAllListeners("close")
})

ipcMain.on('download-plugin', (event, {url,name}) => {
	getZip(url,name).then(()=>{
		event.reply('plugin-installed', true)
	})
})

function getZip(url,pluginName){
	return new Promise((resolve,reject)=>{
		axios({
			method: 'get',
			url,
			responseType: 'stream'
		}).then(async function (response) {
			response.data.pipe(fs.createWriteStream(path.join(PLUGINS_DIR,`${pluginName}.zip`)))
			createPluginFolder(pluginName)
			extractZip(path.join(PLUGINS_DIR,`${pluginName}.zip`),pluginName).then(()=>{
				resolve()
			})
			
		})
	})
}

function createPluginFolder(pluginName){
	fs.mkdirSync(path.join(PLUGINS_DIR,pluginName))
}

function extractZip(zipPath,pluginName){
	return new Promise((resolve,reject)=>{
		zip(zipPath, { dir: path.join(PLUGINS_DIR,pluginName) })
		resolve()
	})
}
app.commandLine.appendSwitch("disable-smooth-scrolling", "true")
