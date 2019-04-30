/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
preload([
		"src/icons/open.svg",
	  "src/icons/custom_icons/git.svg",
	  "src/icons/custom_icons/node_modules.svg"
	])
let current_config = {
	justInstalled : false, //missing
	theme: "Light UI", 
	fontSizeEditor : "15",
	appZoom : "20",
	language : "english",
	animationsPreferences : "activated",
	autoCompletionPreferences: "activated"
}
function loadConfig(){ //Loads the configuration from the config.jsons for the first time
	
	if (!fs.existsSync(configDir)) {
	 	current_config.justInstalled = true;
	  fs.writeFile(configDir, JSON.stringify(current_config)); //Save the config
	  updateSettings();
		loadLanguage(current_config.language);
		if(current_config.justInstalled === false){
		 g_welcomePage();
		}else{
			g_Setup();
		}
		detectPlugins(); //Call the function to detect the installed plugins
	}else{
		fs.readFile(configDir, 'utf8', function (err,data) {
	  	current_config = JSON.parse(data);
	 		//Load config from the config.json when Graviton boots
	 		setThemeByName(current_config["theme"]);
	 		updateSettings();
			loadLanguage(current_config.language);
			if(current_config.justInstalled === false){
			 g_welcomePage();
			}else{
				g_Setup();
			}
			if(current_config.animationsPreferences=="desactivated"){
		  	const  style = document.createElement("style");
					style.innerText = `*{-webkit-transition: none !important;
				  -moz-transition: none !important;
				  -o-transition: none !important;
				  transition: none !important;}`;
				  style.id = "_ANIMATIONS";
				  document.body.insertBefore(style,document.body.children[0]);
		  }else{
		  	const  style = document.createElement("style");
				  style.id = "_ANIMATIONS";
				  document.body.insertBefore(style,document.body.children[0]);
		  } //Will do it if animations is equal to activated
			detectPlugins(); //Call the function to detect the installed plugins
	 	});
	}
	
}
function saveConfig(){ //Saves the configuration to config.json
	let newConfig = {
		justInstalled : current_config.justInstalled,
		theme: current_config.theme["Name"],
		fontSizeEditor : current_config.fontSizeEditor, 
		appZoom : current_config.appZoom,
		language : current_config["language"]["g_l"],
		animationsPreferences : current_config["animationsPreferences"],
		autoCompletionPreferences: current_config["autoCompletionPreferences"]
	}
	newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, (err) => {});
  if(editor!=undefined) editor.refresh();
}