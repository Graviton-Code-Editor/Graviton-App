/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let context_menu_list = { //Initial value
		  "Copy" :" document.execCommand('copy');",
		  "Paste" :" document.execCommand('paste');"
};
function gPlugin(obj) {
	for(i=0; i<plugins_list.length;i++){
			if(plugins_list[i].name==obj.name){ //List package information
					this.name = plugins_list[i].name;
					this.author = plugins_list[i].author; 
					this.version = plugins_list[i].version;
					this.description = plugins_list[i].description;
					var a = i;
			}
	}
	for(i=0; i<plugins_dbs.length;i++){
			if(plugins_dbs[i].plugin_name==obj.name){ //List package information
				var b = i;
			}
	}
	if(this.name ===undefined) {
		console.error(` Plugin > ${obj.name} < doesn't exist `);
		 return;
	}
  this.saveData = function(data){
			plugins_dbs[b].db = data;
			fs.writeFileSync(path.join(plugins_db,this.name)+".json",JSON.stringify(data), function(err) { }); 
  }
  this.setData = function(key,data){
      if(fs.existsSync(path.join(plugins_db,this.name)+".json")){
        let obj = this.getData();
        obj[key] = data;
        fs.writeFileSync(path.join(plugins_db,this.name)+".json", JSON.stringify(obj), function(err) {}); 
        plugins_dbs[b].db = obj; 
      }
  }
  this.createData = function(data){
			if(!fs.existsSync(path.join(plugins_db,this.name)+".json")){
				const db = {
			 			plugin_name:this.name,
			 			db:data
				};
				plugins_dbs.push(db);
				b = plugins_dbs.length-1;
				fs.writeFileSync(path.join(plugins_db,this.name)+".json", JSON.stringify(data), function(err) {}); 
				return "created";
			}else{
				return "already_exists";
			}
  }
  this.getData = function(){
			return plugins_dbs[b].db;
  }
  this.deleteData = function(data){
			switch(data){
				case undefined:
					plugins_dbs[b].db = {}; 
					fs.writeFileSync(path.join(plugins_db,this.name)+".json", "{}", function(err) {}); 
				break;
				default:
					const obj = this.getData();
					delete obj[data];
					fs.writeFileSync(path.join(plugins_db,this.name)+".json",JSON.stringify(obj), function(err) {}); 
					plugins_dbs[b].db = obj; 
			}
	}
}
function dropMenu(obj){
	this.id = obj.id;
  if(obj!=null && obj!=undefined) this.translation = obj.translation; //Detect if translation is enabled on the plugin's dropmenu
	this.setList = function(panel){
    if(document.getElementById(this.id+"_dropbtn")!=undefined){
			const droplist = document.getElementById(this.id+"_dropbtn");
			droplist.innerHTML = ""; //Remove current code and then add the updated one
			droplist.parentElement.children[0].innerText = panel.button;
			let last;
			let toTransx = this.translation;
				Object.keys(panel).forEach(function(attr) {
					if(panel[attr]==panel["list"] && panel["list"]!=undefined && last !="list"){ //List
						last = "list";
						Object.keys(panel["list"]).forEach(function(key) {
						if(key=="*line"){
								droplist.innerHTML += `<span class="line_space_menus"></span>`;
						}else{
							if(toTransx !=true){
								droplist.innerHTML += `<button onclick="${panel["list"][key]}" >${key}</button>`
							}else{
								droplist.innerHTML += `<button  class=" translate_word  " idT="${key.replace(/ +/g, "")}" onclick="${panel["list"][key]}" >${key}</button>`
							}			
						}
					});
				}
				if(panel[attr]==panel["custom"] && panel["custom"]!=undefined && last !="custom"){ //Custom
					droplist.innerHTML += panel["custom"];
					last = "custom";
				}
			});
		}else{
			const bar = document.getElementById("g_dropmenu_list");
			const newTab = document.createElement("div");
			const droplist = document.createElement("div");
			droplist.classList = "dropdown-content hide";
			droplist.setAttribute("id",this.id+"_dropbtn");
			newTab.classList.add("dropdown");
			if(this.translation !=true){
				newTab.innerHTML = `
				<button onclick="interact_dropmenu('${this.id}_dropbtn')" class="dropbtn" >${panel["button"]}</button>`
			}else{
				newTab.innerHTML = `
				<button class=" translate_word dropbtn " idT="${panel["button"].replace(/ +/g, "")}" onclick="interact_dropmenu('${this.id}_dropbtn')"  >${panel["button"]}</button>`
			}
			let last;
			let toTransx = this.translation;
				Object.keys(panel).forEach(function(attr) {
					if(panel[attr]==panel["list"] && panel["list"]!=undefined && last !="list"){ //List
						last = "list";
						Object.keys(panel["list"]).forEach(function(key) {
						if(key=="*line"){
								droplist.innerHTML += `<span class="line_space_menus"></span>`;
						}else{
							if(toTransx !=true){
								droplist.innerHTML += `<button onclick="${panel["list"][key]}" >${key}</button>`
							}else{
								droplist.innerHTML += `<button  class=" translate_word  " idT="${key.replace(/ +/g, "")}" onclick="${panel["list"][key]}" >${key}</button>`
							}			
						}
					});
				}
				if(panel[attr]==panel["custom"] && panel["custom"]!=undefined && last !="custom"){ //Custom
					droplist.innerHTML += panel["custom"];
					last = "custom";
				}
			});
			newTab.appendChild(droplist);
			bar.appendChild(newTab);
		}
	}
}
const graviton = {
 	getCurrentTheme : function(){ //Get the theme name of the applied theme
 		return current_config.theme;
 	},
 	getSelectedText: function(){ //Get te text you have selected
 		const selected_text = window.getSelection().toString();
 		if( selected_text !==""){
 			return selected_text;
 		} else return null; //Returns null if there is not text selected
 	},
 	setThemeByName: function(name){ //Set a theme by it's name
 		return setThemeByName(name);
 	},
 	getCurrentFile: function(){
 		const _file ={
 			"path" : filepath
 		};
 		return _file;
 	},
 	getCurrentEditor: function(){
 		for(i=0; i<editors.length;i++){ //returns the current selected editor 
 			if(editorID == editors[i].id){
 				return editors[i];
 			}
 		}
 		if(editors.length==0) return "empty";
 	},
 	getCurrentDirectory:function(){
 		return FirstFolder;
 	},
 	currentOS: function(){
 		return process.platform; 
 	},
 	openDevTools: function(){
 		app.webContents.openDevTools();
 	}
}
function contextMenu(panel){ //Add buttons to the context menu from the plugin
	Object.keys(panel).forEach(function(key) {
		context_menu_list[key] = panel[key];
	});
}
function floatingWindow([xSize,ySize],content){ //Method to create flaoting windows
	const g_floating_window = document.createElement("div");
	FLOATING_WINDOW.style.height = ySize+"px";
	FLOATING_WINDOW.style.width = xSize+"px";
	FLOATING_WINDOW.classList = "floating_window";
	FLOATING_WINDOW.innerHTML = content;
	document.body.appendChild(g_floating_window);
}
document.addEventListener('mousedown', function(event){ //Create the context menu
	if(editor_booted===true){
    if (event.button === 2) {
      if(document.getElementById("context_menu")!==null ){
        document.getElementById("context_menu").remove();
      }
      const context_menu = document.createElement("div");
      const line_space = document.createElement("span");
      line_space.classList = "line_space_menus";
      context_menu.setAttribute("id","context_menu");
      context_menu.style = `left:${event.pageX}px; top:${event.pageY}px`;
      Object.keys(context_menu_list).forEach(function(key,index) {
        const button = document.createElement("button");
        button.classList.add("part_of_context_menu")
        if(index <2){
        	button.innerText = current_config.language[key];
        	context_menu.appendChild(button);
      	}else{
      		if(index==2){
        		context_menu.appendChild(line_space); 
        	}
        	button.innerText = key;
        	context_menu.appendChild(button);
      	}
        button.setAttribute("onclick",context_menu_list[key]+" document.getElementById('context_menu').remove();");
      });
      document.body.appendChild(context_menu);
    }else if(event.button ===0 && !(event.target.matches('#context_menu') || event.target.matches('.part_of_context_menu'))&& document.getElementById("context_menu")!==null){
        document.getElementById("context_menu").remove();
    }
    if(!event.target.matches('.floating_window')){
    	if(document.getElementsByClassName('floating_window').length !=0){
    		for(i=0; i <document.getElementsByClassName('floating_window').length;i++){
    			document.getElementsByClassName('floating_window')[i].remove();
    		}
    	}
    }
  }
});
function Notification(title, message) { //Method to create notifications
  if (_notifications.length >= 3) {
    _notifications[0].remove();
    _notifications.splice(0, 1);
  }
  const textID = Math.random();
  const body = document.createElement("div");
  body.classList.add("notificationBody");
  body.setAttribute("id", _notifications.length);
  body.innerHTML =
    ` <button   onclick="closeNotification(this)">
        ${close_icon}
      </button>
      <h1>
        ${title} 
      </h1>
      <div>
        <p id="notification_message${textID}">
        </p>
      </div>`;
  document.getElementById("notifications").appendChild(body);
  document.getElementById("notification_message" + textID).innerText = message;
  _notifications.push(body);
  let seveTS = new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      clearTimeout(wait);
      for (i = 0; i < _notifications.length; i++) {
        if (_notifications[i] === body) {
          _notifications.splice(i, 1);
          body.remove();
        }
      }
    }, 7000); //Wait 7 seconds until the notification auto deletes it selfs
  });
  let race = Promise.race([seveTS]);
}
function closeNotification(element) {
  for (i = 0; i < _notifications.length; i++) {
    if (_notifications[i] === element.parentElement) {
      _notifications.splice(i, 1);
      element.parentElement.remove();
    }
  }
}
const closeDialog = (me)=> document.getElementById(me.getAttribute("myID") + "D").remove();
function createDialog(obj) {
  const all = document.createElement("div");
  all.setAttribute("id", obj.id + "D");
  all.setAttribute("style", "-webkit-user-select: none;");
  const background = document.createElement("div");
  background.setAttribute("class", "opened_window");
  background.setAttribute("myID", obj.id);
  background.setAttribute("onclick", "closeDialog(this)");
  const body_dialog = document.createElement("div");
  body_dialog.setAttribute("class", "dialog_body");
  body_dialog.innerHTML =`
  <p style="font-size:25px; line-height:1px; white-space: nowrap; font-weight:bold;">    
  		${obj.title} 
  </p>
  <p style="font-size:15px;">
    	${obj.content}
  </p>`;
  Object.keys(obj.buttons).forEach(function(key,index) {
  	const button = document.createElement("button");
  	button.innerText = key;
  	button.setAttribute("myID",obj.id);
  	button.setAttribute("onclick",obj.buttons[key]);
  	button.classList = "_dialog_button";
  	body_dialog.appendChild(button);
  });
  all.appendChild(background);
  all.appendChild(body_dialog);
  document.body.appendChild(all);
}