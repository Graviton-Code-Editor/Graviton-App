/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let plugins_list = [];
let plugins_dbs= [];
const g_open_plugins_folder = () =>{
	const {shell} = require('electron') // deconstructing assignment
	shell.openItem(plugins_folder)	
}
function openPlugins(){
	const plugins_window = new Window({
	id:"plugins_window",
	content:`
		<h2 class="window_title">`+current_config.language["Plugins"]+`</h2> 
	  <div class="section">
	  	<button class="button1" onclick="g_open_plugins_folder()">${current_config.language["OpenFolder"]}</button>
		</div>
		<div id="plugins_list">
		</div>`
	})
	plugins_window.launch()
	plugins_list.forEach(plugin => {
			document.getElementById("plugins_list").innerHTML+=`
			<div class="section_hover">
				${plugin["name"] + " · v"+ plugin["version"]}
				<p style="font-size:15px;">${current_config.language["MadeBy"] + plugin["author"]}</p>
				<p styl="font-size:13px; line-height:2px;">${plugin["description"]}</p>
			</div>
			`
  });
	if(plugins_list.length ==0)content.innerHTML += `<p>No plugins detected.</p>`
}
function detectPlugins(){
	if (!fs.existsSync(plugins_db)) { //If the plugins_db folder doesn't exist
	  fs.mkdirSync(plugins_db);
	}else{   //If the plugins_db folder already exist
		fs.readdir(plugins_db, (err, paths) => {
			for(i=0; i<paths.length;i++){
				const dir = paths[i];
				if (dir.indexOf('.') > -1 && getFormat(dir)=="json"){ 
		  		fs.readFile(path.join(plugins_db, dir), 'utf8', function (err, data) {
				 		plugins_dbs.push({
				 			plugin_name:path.basename(dir,".json"),
				 			db:JSON.parse(data)
				 		});
					});
		  	}
			}
		 });
	 } 	
	if (!fs.existsSync(plugins_folder)) { //If the plugins folder doesn't exist
	  fs.mkdirSync(plugins_folder);
		fs.copy(path.join(__dirname,"plugins"),plugins_folder, err=> {
 			fs.readdir(plugins_folder, (err, paths) => {
	  		paths.forEach(dir => {
		  		const direct = fs.statSync(path.join(plugins_folder,dir));
	      	if (!direct.isFile()){
			  		fs.readFile(path.join(plugins_folder, dir,"package.json"), 'utf8', function (err, data) {
			  				const config = JSON.parse(data);
			 		 			if (err) throw err;
			 		 			plugins_list.push(config);
					 		 	const script = document.createElement("script");
					 		 	script.setAttribute("src",path.join(plugins_folder,config["folder"],config["main"])),
					 		 	document.body.appendChild(script);
					 		 	for(i=0;i<config["javascript"].length;i++){
					 		 			const script = document.createElement("script");
					 		 			script.setAttribute("src",path.join(plugins_folder,config["folder"],config["javascript"][i])),
					 		 			document.body.appendChild(script);
					 		 	}
					 		 	for(i=0;i<config["css"].length;i++){
					 		 			const link = document.createElement("link");
					 		 			link.setAttribute("rel","stylesheet");
					 		 			link.setAttribute("href",path.join(plugins_folder,config["folder"],config["css"][i])),
					 		 			document.body.appendChild(link);
					 		 	}
						});
			  	}
		  	});
			});
    });
	}else{   //If the plugins folder already exist
	fs.readdir(plugins_folder, (err, paths) => {
	  	paths.forEach(dir => {
	  		const direct = fs.statSync(path.join(plugins_folder,dir));
      	if (!direct.isFile()){
		  		fs.readFile(path.join(plugins_folder, dir,"package.json"), 'utf8', function (err, data) {
		  				const config = JSON.parse(data);
		 		 			if (err) throw err;
		 		 			plugins_list.push(config);
				 		 	const script = document.createElement("script");
				 		 	script.setAttribute("src",path.join(plugins_folder,config["folder"],config["main"])),
				 		 	document.body.appendChild(script);
				 		 	for(i=0;i<config["javascript"].length;i++){
					 		 			const script = document.createElement("script");
					 		 			script.setAttribute("src",path.join(plugins_folder,config["folder"],config["javascript"][i])),
					 		 			document.body.appendChild(script);
					 		}
					 		for(i=0;i<config["css"].length;i++){
					 		 			const link = document.createElement("link");
					 		 			link.setAttribute("rel","stylesheet");
					 		 			link.setAttribute("href",path.join(plugins_folder,config["folder"],config["css"][i])),
					 		 			document.body.appendChild(link);
					 		}
					});
	  		}
	  	});
		});
	}	
}