/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

const url = require("url")
const path = require("path")
const { app, BrowserWindow } = require("electron")
const windowStateKeeper = require('electron-window-state');
let main // Main window

app.on("ready", function() {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 750,
		defaultHeight: 650
	  });
	main = new BrowserWindow({
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
			nodeIntegration: true
		},
		frame: process.platform === "linux",
		x:mainWindowState.x,
		y:mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minHeight: 320,
		minWidth: 320,
		backgroundColor: "#191919",
		title: "Graviton Editor",
		icon: __dirname + '/assets/general.png',
		show:false
	})
	mainWindowState.manage(main);
	main.loadURL(
		url.format({
			pathname: path.join(__dirname, "index.html"),
			protocol: "file:",
			slashes: true
		})
	)
	main.on("ready-to-show", () => {
		main.show()
		main.focus()
	})
	if (
		path.basename(__dirname) === "Graviton-Editor" ||
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
app.commandLine.appendSwitch("disable-smooth-scrolling", "true")
