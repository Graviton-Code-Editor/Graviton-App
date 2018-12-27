let config = " ";
let configDir = __dirname+"\\config.json";
let newConfig ;
let zoom_app;

var _firsTime;
//Variables
let FontSizeEditor = " ";
function loadConfig(){ //Loads the configuration from the config.json
	fs.readFile(configDir, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  config = JSON.parse(data);
 		//Load config
 		setThemeByName(config["Theme"]);
 		FontSizeEditor = config["FontSizeEditor"];
 		zoom_app = config["Zoom"];
 		_firsTime = config["FirstTime"];
 		console.log("adeu"+_firsTime);
		updateSettings();
		loadTimeSpent();
 });
	 
	
	
}

function saveConfig(){ //Saves the configuration to config.json
	newConfig = {
		FirstTime: _firsTime,
		Theme:current_theme["Name"],
		FontSizeEditor: FontSizeEditor,
		Zoom:zoom_app
	};

	FontSizeEditor = newConfig["FontSizeEditor"];
	newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, (err) => {
    });
  myCodeMirror.refresh();
}




