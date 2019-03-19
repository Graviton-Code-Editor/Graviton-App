
let zoom_app;
var _firsTime;
//Variables
let FontSizeEditor = "20"; //Default



function loadConfig(){ //Loads the configuration from the config.json


	if (!fs.existsSync(configDir)) {

		setThemeByName("Light Accented");
	  	FontSizeEditorr = "20";
	 		zoom_app = "20";
	 		_firsTime = true;
	 		selected_language = "english"; 

	    var newConfig = {
				FirstTime: _firsTime,
				Theme:"Light Accented",
				FontSizeEditor: FontSizeEditorr,
				Zoom:zoom_app,
				Language:selected_language,
			};

		newConfig = JSON.stringify(newConfig);
	  fs.writeFile(configDir, newConfig, (err) => {});

	  updateSettings();
		
		loadLanguage(selected_language);

		if(_firsTime === false){
		 welcomePage();
		}else{
			FirstTime();
		}

		detectPlugins(); //Call the function to detect the installed plugins

	}else{

		fs.readFile(configDir, 'utf8', function (err,data) {
	  	var config = JSON.parse(data);
	 		//Load config
	 		setThemeByName(config["Theme"]);
	 		FontSizeEditor = config["FontSizeEditor"];
	 		zoom_app = config["Zoom"];
	 		_firsTime = config["FirstTime"];
	 		selected_language = config["Language"];	

	 		updateSettings();
		
			loadLanguage(selected_language);

			if(_firsTime === false){
			 welcomePage();
			}else{
				FirstTime();
			}

			detectPlugins(); //Call the function to detect the installed plugins

	 	});
		

	 	 

	}
	
}

function saveConfig(){ //Saves the configuration to config.json
	var newConfig = {
		FirstTime: _firsTime,
		Theme:current_theme["Name"],
		FontSizeEditor: FontSizeEditor,
		Zoom:zoom_app,
		Language:selected_language["Name"],
	};
	FontSizeEditor = newConfig["FontSizeEditor"];
	newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, (err) => {
    });
  editor.refresh();
}




