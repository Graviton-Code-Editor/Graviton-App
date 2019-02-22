
var plugins_list = [];
function detectPlugins(){
	if (!fs.existsSync(plugins_folder)) { //If the plugins folder doesn't exist
	  fs.mkdirSync(plugins_folder);

	}else{   //If the plugins folder already exist

	fs.readdir(plugins_folder, (err, paths) => {
	  	paths.forEach(dir => {
	  		if (dir.indexOf('.') > -1){

		  		fs.readFile(path.join(plugins_folder, dir), 'utf8', function (err, data) {
		  			var config = JSON.parse(data);
		 		 			if (err) throw err;
		 		 			plugins_list.push(config);
				 		 	const script = document.createElement("script");
				 		 	script.setAttribute("src",path.join(plugins_folder,config["main"])),
				 		 	document.body.appendChild(script);
				 		
					});
	  	}
	  	});
	  	
		});
	}	
}

function dropMenu(panel){ //Create dropmenu panels from the plugin
	const bar = document.getElementById("control-bar").children[3];
	const newTab = document.createElement("div");
	const droplist = document.createElement("div");
	droplist.classList = "dropdown-content hide";
	droplist.setAttribute("id",panel["button"]);
	newTab.classList.add("dropdown");
	newTab.innerHTML = `
	<button onclick="dropmenu('`+panel["button"]+`')" class="dropbtn" >`+panel["button"]+`</button>

	`
		Object.keys(panel["list"]).forEach(function(key) {

			droplist.innerHTML += `<a onclick="`+panel["list"][key]+`" >`+key+`</a>`

		});

	newTab.appendChild(droplist);
	bar.appendChild(newTab);

}
var context_menu_list;
function contextMenu(panel){ //Add buttons to the context menu from the plugin
	Object.keys(panel).forEach(function(key) {
		context_menu_list = { //Default Context menu
		  "Copy" :" document.execCommand('copy');",
		  "Paste" :" document.execCommand('paste');"
		};	

		context_menu_list[key] = panel[key];

	});
}



document.addEventListener('mousedown', function(event){ //Create the context menu
	if(editor_booted===true){
    if (event.button === 2) {
      if(document.getElementById("context_menu")!==null ){
        document.getElementById("context_menu").remove();
      }
      const context_menu = document.createElement("div");
      context_menu.setAttribute("id","context_menu");
      context_menu.style = "left:"+event.pageX+"; top:"+event.pageY+"px";

      Object.keys(context_menu_list).forEach(function(key,index) {

        const button = document.createElement("button");
        button.classList.add("part_of_context_menu")
        if(index <2){
        	button.innerText = selected_language[key];
      	}else{
        	button.innerText = key;
      	}
        button.setAttribute("onclick",context_menu_list[key]+" document.getElementById('context_menu').remove();");
        context_menu.appendChild(button);

      });
      document.body.appendChild(context_menu);

    }else if(event.button ===0 && !(event.target.matches('#context_menu') || event.target.matches('.part_of_context_menu'))&& document.getElementById("context_menu")!==null){

        document.getElementById("context_menu").remove();
    }
  }
});
function hidePlugins(){
	document.getElementById("window").remove();
	saveConfig();
}

function openPlugins(){


	var all = document.createElement("div");
	all.setAttribute("id","window");
	all.setAttribute("style","-webkit-user-select: none;");

	var background = document.createElement("div");
	background.setAttribute("class","opened_window");
	background.setAttribute("onclick","hideSettings()"); 
	
	var body = document.createElement("div");
	body.setAttribute("class","body_window");
	body.setAttribute("id","body_window");
	
	var content = document.createElement("div");
	content.setAttribute("id","plugins_list");
	content.innerHTML = `<p class="window_title">`+selected_language["Plugins"]+`</p> `

	plugins_list.forEach(plugin => {

 		 				var pluginDiv = document.createElement("div");
						pluginDiv.classList.add("plugin_div");
						pluginDiv.innerText = plugin["name"] + " · v"+ plugin["version"];
						var author = document.createElement("p");
						author.innerText = selected_language["Phrase3"] + plugin["author"];
						author.setAttribute("style","font-size:15px")
						var description = document.createElement("p");
						description.innerText = plugin["description"];
						description.setAttribute("style","font-size:13px; line-height:2px;");

						
						pluginDiv.appendChild(author);
						pluginDiv.appendChild(description);
						content.appendChild(pluginDiv);
		
  	});

	
	body.appendChild(content);

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
	
}


 const editor = {
 	getCurrentText : function(){ //GEt all the text of the current file editing
 		return myCodeMirror.getValue();
 	},
 	getCurrentTheme : function(){ //Get the fuckk object of the applied theme
 		return current_theme;
 	},
 	getSelectedText: function(){ //Get te text you have selected
 		const selected_text = window.getSelection().toString();
 		if( selected_text !=""){
 			return selected_text;
 		} else return null; //Returns null if there is not text selected
 	},
 	setThemeByName: function(name){ //Set a theme by it's name
 		return setThemeByName(name);
 	}
 }	

