/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

const url = require("url")
const path = require("path")
const { app, BrowserWindow } = require("electron")
let main // Main window

app.on("ready", function() {
  main = new BrowserWindow({
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true
    },
    frame: process.platform != "win32",
    width: 750,
    height: 650,
    minHeight: 310,
    minWidth: 310,
    backgroundColor: "#191919",
    title: "Graviton Editor"
  })
  main.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  )
  main.setMenuBarVisibility(
    path.basename(__dirname) === "Graviton-Editor" ||
      path.basename(__dirname) === "Graviton-App"
  ) // True = when it's not on production
})
app.on("window-all-closed", () => {
  app.quit()
})
app.on("before-quit", () => {
  app.removeAllListeners("close")
})
app.commandLine.appendSwitch("disable-smooth-scrolling", "true")




