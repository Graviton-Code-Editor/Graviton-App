/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow,globalShortcut, BrowserView} = electron;
const Menu = electron.Menu;
let main; //Main window

app.on('ready', function(){
  main = new BrowserWindow({
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
    }, 
    frame: process.platform!="win32"? true:false, 
    width: 750, 
    height: 650 ,
    'minHeight': 310,
    'minWidth': 310,
    backgroundColor: "rgba(255,255,255,0)",
    title:"Graviton Editor"
  });
  main.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  main.setMenuBarVisibility(path.basename(__dirname) === "Graviton-Editor")//True= when it's already packaged
});
app.on('window-all-closed', ()=>{
  app.quit();
});
app.on('before-quit', () => {
    main.removeAllListeners('close');
    main.close();
});
app.commandLine.appendSwitch('disable-smooth-scrolling', 'true');