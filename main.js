const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');



const {app, BrowserWindow,globalShortcut} = electron;
const Menu = electron.Menu;

let mainWindow;
	
app.on('ready', function(){
	mainWindow = new BrowserWindow({
		titleBarStyle: 'customButtonsOnHover', 
		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegrationInWorker: true,
		},
		frame: false, 
		width: 750, 
		height: 650 ,
		'minHeight': 250,
  	'minWidth': 250,
  	backgroundColor: "#FFF"
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));
	//mainWindow.webContents.openDevTools() 
	//mainWindow.setMenu(null); 
});

app.on('window-all-closed', ()=>{
  app.quit();
});

app.commandLine.appendSwitch('disable-smooth-scrolling', 'true');





