/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow,globalShortcut} = electron;
const Menu = electron.Menu;
let mainWindow;
app.on('ready', function(){
	mainWindow = new BrowserWindow({
		titleBarStyle: "customButtonsOnHover", 
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
		},
		frame: process.platform!="win32"? true:false, 
		width: 750, 
		height: 650 ,
		'minHeight': 250,
  	'minWidth': 250,
  	backgroundColor: "#FFF",
  	title:"Graviton"
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));
	//mainWindow.webContents.openDevTools() //Disable the dev tools when opening Graviton
	mainWindow.setMenu(null); 
});
app.on('window-all-closed', ()=>{
  app.quit();
});
app.commandLine.appendSwitch('disable-smooth-scrolling', 'true');