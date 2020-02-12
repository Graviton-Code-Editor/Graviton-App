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
let main 
const isDev = require('electron-is-dev');
 
app.on("ready", function() {
	main = new BrowserWindow({
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
			nodeIntegration: true
		},
		frame: process.platform !== "win32",
		minHeight: 320,
		minWidth: 320,
		backgroundColor: "#191919",
		title: "Graviton Editor",
		show:false
    })
    if (isDev) {
        main.loadURL("http://localhost:4321/")
    } else {
        main.loadURL(
            url.format({
                pathname: path.join(__dirname,"parcel", "index.html"),
                protocol: "file:",
                slashes: true
            })
        )
    }
	
	main.on("ready-to-show", () => {
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
