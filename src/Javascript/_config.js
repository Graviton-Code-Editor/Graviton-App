/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let zoom_app;
let _firsTime;
let FontSizeEditor = "15"; //Default
let ANIMATIONS_STATUS; 
function loadConfig(){ //Loads the configuration from the config.jsons for the first time
	if (!fs.existsSync(configDir)) {
		/*Default Config*/
		setThemeByName("Light UI");
	  	FontSizeEditorr = "15";
	 		zoom_app = "20";
	 		_firsTime = true;
	 		selected_language = "english"; 
	 		ANIMATIONS_STATUS = "activated"; //Animations are ON by default

	   let newConfig = {
				FirstTime: _firsTime,
				Theme:"Light UI",
				FontSizeEditor: FontSizeEditorr,
				Zoom:zoom_app,
				Language:selected_language,
				animations:ANIMATIONS_STATUS
			};
		newConfig = JSON.stringify(newConfig);
	  fs.writeFile(configDir, newConfig, (err) => {}); //Save the config
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
	  	const config = JSON.parse(data);
	 		//Load config from the config.json when Graviton boots
	 		setThemeByName(config["Theme"]);
	 		FontSizeEditor = config["FontSizeEditor"];
	 		zoom_app = config["Zoom"];
	 		_firsTime = config["FirstTime"];
	 		selected_language = config["Language"];	
	 		ANIMATIONS_STATUS = config["animations"]

	 		updateSettings();
		
			loadLanguage(selected_language);

			if(_firsTime === false){
			 welcomePage();
			}else{
				FirstTime();
			}
			if(ANIMATIONS_STATUS=="desactivated"){
		  	const  style = document.createElement("style");
					style.innerText = `*{-webkit-transition: none !important;
				  -moz-transition: none !important;
				  -o-transition: none !important;
				  transition: none !important;}`;
				  style.id = "_ANIMATIONS";
				  document.body.insertBefore(style,document.body.children[0]);
		  } //Will do it if animations is equal to activated
			detectPlugins(); //Call the function to detect the installed plugins
	 	});
	}
}

function saveConfig(){ //Saves the configuration to config.json
	let newConfig = {
		FirstTime: _firsTime,
		Theme:current_theme["Name"],
		FontSizeEditor: FontSizeEditor,
		Zoom:zoom_app,
		Language:selected_language["Name"],
		animations: ANIMATIONS_STATUS
	};
	FontSizeEditor = newConfig["FontSizeEditor"];
	newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, (err) => {});
  editor.refresh();
  
}




