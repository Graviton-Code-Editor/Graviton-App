let config = " ";
let configDir = __dirname+"\\config.json";
let newConfig ;

//Variables
let FontSizeEditor = " ";
function loadConfig(){
	fs.readFile(configDir, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  config = JSON.parse(data);
 		//Load config
 		setThemeByName(config["Theme"]);
 		FontSizeEditor = config["FontSizeEditor"];

		updateSettings();
 });
	 
	welcomePage();
}

function saveConfig(){
	newConfig = {
		Theme:current_theme["Name"],
		FontSizeEditor:document.getElementById("fs-input").value
	};

	FontSizeEditor = newConfig["FontSizeEditor"];
	newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, (err) => {
    });
  myCodeMirror.refresh();
}




