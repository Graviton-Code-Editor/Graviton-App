const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

let {ipcMain} = electron;
ipcMain.on('resize', function (e, x, y) {
mainWindow.setSize(x, y);
});
const {app, BrowserWindow} = electron;
const Menu = electron.Menu;

let mainWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		titleBarStyle: 'customButtonsOnHover', 
		webpreferences: {
			nodeIntegration: true
		},
		frame: false, 
		x: 50,
		y: 50,
		width: 50, 
		height: 50 ,
		'minHeight': 300,
  	'minWidth': 300
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
		
	}));

	//mainWindow.webContents.openDevTools() 
	//mainWindow.setMenu(null); 

});


app.commandLine.appendSwitch('disable-smooth-scrolling', 'true');





