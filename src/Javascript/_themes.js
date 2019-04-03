/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let themes =[];
let current_theme = " ";
	
if (!fs.existsSync(highlights_folder)) { //If the themes folder doesn't exist
  fs.mkdirSync(highlights_folder)

   fs.copy(path.join(__dirname,"src","Highlights"),highlights_folder, err=> {
            if(err) return console.error(err);
            syncThemes();
    });

}else{
	syncThemes();
}
function syncThemes(){
		if (!fs.existsSync(themes_folder)) { //If the themes folder doesn't exist
		  fs.mkdirSync(themes_folder)

		   fs.copy(path.join(__dirname,"themes"),themes_folder, err=> {
		            if(err) return console.error(err);
		            fs.readdir(themes_folder, (err, paths) => {
						  	paths.forEach(dir => {
						  		fs.readFile(path.join(themes_folder, dir), 'utf8', function (err, data) {
						 		 	if (err) throw err;
						 		 		obj = JSON.parse(data);
						 		 		themes.push(obj); //Push the theme to the array

						 		 		var newLink = document.createElement("link");
						 		 		newLink.setAttribute("rel","stylesheet");
										newLink.setAttribute("href",path.join(highlights_folder,obj["Highlight"]+".css")); //Link new themes 
										document.body.appendChild(newLink);
								
									});
						  	});
						  	
							});

		     });

		}else{ //If the themes folder already exists
		  	fs.readdir(themes_folder, (err, paths) => {
		  	paths.forEach(dir => {
				  		fs.readFile(path.join(themes_folder, dir), 'utf8', function (err, data) {
					 		 		if (err) throw err;
					 		 		obj = JSON.parse(data);

					 		 		themes.push(obj); //Push the theme to the array
					 		 		var newLink = document.createElement("link");
					 		 		newLink.setAttribute("rel","stylesheet");
									newLink.setAttribute("href",path.join(highlights_folder,obj["Highlight"]+".css")); //Link new themes 
									document.body.appendChild(newLink);
							
							});
		  		
		  	});
		  	
			});
		  	
		}
}
detectLanguages();

  

	
	

var currentTheme;
function loadTheme(ThemeNumber){

	var colors = themes[ThemeNumber]["Colors"]; //Take the colors object inside the JSON file of the selected theme
	for(i = 0;i < Object.keys(colors).length;i++){
		document.documentElement.style.setProperty("--"+Object.keys(colors)[i],colors[Object.keys(colors)[i]]); //Update the CSS variables
	}
	applyHighlighter(ThemeNumber);
	saveConfig(); //Save the current configuration

}

function applyHighlighter(ThemeNumber){
	editor.setOption("theme", themes[ThemeNumber]["Highlight"]); //Update highlither after applying a new theme
	current_theme = themes[ThemeNumber];
	currentTheme = ThemeNumber;
}
function setThemeByName(name){
	
	
	for(i = 0;i < themes.length;i++){
		if(themes[i]["Name"]== name){
			var ThemeNumber = i;
			var colors = themes[ThemeNumber]["Colors"]; //Take the colors object inside the json file of the selected theme
			for(i = 0;i < Object.keys(colors).length;i++){
				document.documentElement.style.setProperty("--"+Object.keys(colors)[i],colors[Object.keys(colors)[i]]); //Update UI colors
			}
			applyHighlighter(ThemeNumber);

		}
	}

}

