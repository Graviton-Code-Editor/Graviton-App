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
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');

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
		show:false
	})
	if( !isDev ) main.removeMenu()
	mainWindowState.manage(main);

    if (isDev) {
        main.loadURL("http://localhost:4321/")
    } else {
        main.loadURL(
            url.format({
                pathname: path.join(__dirname,"dist_parcel", "index.html"),
                protocol: "file:",
                slashes: true
            })
        )
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

app.commandLine.appendSwitch("disable-smooth-scrolling", "true")
