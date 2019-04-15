/*
########################################
              MIT License

Copyright (c) 2019 Graviton Editor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow,globalShortcut} = electron;
const Menu = electron.Menu;
let main; //Main window
app.on('ready', function(){
  main = new BrowserWindow({
    titleBarStyle: "customButtonsOnHover", 
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
    }, 
    frame: process.platform!="win32"? true:false, 
    width: 750, 
    height: 650 ,
    'minHeight': 300,
    'minWidth': 300,
    backgroundColor: "rgba(255,255,255,0)",
    title:"Graviton"
  });
  main.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  //main.webContents.openDevTools() //Disable the dev tools when opening Graviton
  //main.setMenubarVisibility(false) //Remove the comment when it's on production
});
app.on('window-all-closed', ()=>{
  app.quit();
});
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});
app.commandLine.appendSwitch('disable-smooth-scrolling', 'true');