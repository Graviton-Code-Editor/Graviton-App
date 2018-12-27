
var themes =[];
var current_theme = " ";
	
	var themes_folder = path.join(__dirname, SlashesNum+'themes');
	fs.readdir(themes_folder, (err, paths) => {
  	paths.forEach(path => {
  		fs.readFile(themes_folder+SlashesNum+path, 'utf8', function (err, data) {
 		 	if (err) throw err;
 		 		obj = JSON.parse(data);
 		 		themes.push(obj); //Push the theme to the array
 		 		var newLink = document.createElement("link");
 		 		newLink.setAttribute("rel","stylesheet");
				newLink.setAttribute("href","src/Highlights/"+obj["Highlight"]+".css"); //Link new themes 
				document.body.appendChild(newLink);
		
			});
  	});
  	loadConfig();
	});
	


function loadTheme(ThemeNumber){
	var colors = themes[ThemeNumber]["Colors"]; //Take the colors object inside the json file of the selected theme
	for(i = 0;i < Object.keys(colors).length;i++){
		document.documentElement.style.setProperty("--"+Object.keys(colors)[i],colors[Object.keys(colors)[i]]); //Update UI colors
	}
	myCodeMirror.setOption("theme", themes[ThemeNumber]["Highlight"]); //Update highlither after applying a new theme
	current_theme = themes[ThemeNumber];
	saveConfig(); //Save the current configuration
}

function setThemeByName(name){
	
	
	for(i = 0;i < themes.length;i++){
		if(themes[i]["Name"]== name){
			var ThemeNumber = i;
			var colors = themes[ThemeNumber]["Colors"]; //Take the colors object inside the json file of the selected theme
			for(i = 0;i < Object.keys(colors).length;i++){
				document.documentElement.style.setProperty("--"+Object.keys(colors)[i],colors[Object.keys(colors)[i]]); //Update UI colors
			}
			myCodeMirror.setOption("theme", themes[ThemeNumber]["Highlight"]); //Update highlither after applying a new theme
			current_theme = themes[ThemeNumber];

			


		}
	}

}

