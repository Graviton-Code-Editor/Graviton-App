const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs'); 

const {app, BrowserWindow} = electron;
const Menu = electron.Menu;

let mainWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		titleBarStyle: 'customButtonsOnHover', 
		frame: false, 
		width: 900, 
		height: 700 ,
		'minHeight': 500,
  	'minWidth': 550
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





