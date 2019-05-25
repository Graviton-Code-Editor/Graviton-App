/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let context_menu_list_text = { //Initial value
  "Copy" :" document.execCommand('copy');",
  "Paste" :" document.execCommand('paste');"
};
let context_menu_list_tabs = { //Initial value
	"Close" :`console.log(document.getElementById(this.getAttribute("target")).getAttribute("TabID")); g_closeTab(document.getElementById(this.getAttribute("target")).getAttribute("TabID"));`
};
class plugin{
	constructor(object){
		for(i=0; i<plugins_list.length;i++){
				if(plugins_list[i].name==object.name){ //List package information
						this.name = plugins_list[i].name;
						this.author = plugins_list[i].author; 
						this.version = plugins_list[i].version;
						this.description = plugins_list[i].description;
				}
		}
		for(i=0; i<plugins_dbs.length;i++){
				if(plugins_dbs[i].plugin_name==object.name){ //List package information
					this.b = i;
				}
		}
		if(this.name==undefined) {
			console.error(` Plugin > ${object.name} < doesn't exist `);
			 return;
		}
	}
  saveData(data){
			plugins_dbs[this.b].db = data;
			fs.writeFileSync(path.join(plugins_db,this.name)+".json",JSON.stringify(data), function(err) { }); 
  }
  setData(key,data){
      if(fs.existsSync(path.join(plugins_db,this.name)+".json")){
        let object = this.getData();
        object[key] = data;
        fs.writeFileSync(path.join(plugins_db,this.name)+".json", JSON.stringify(object), function(err) {
        	plugins_dbs[this.b].db = object; 
        }); 
      }
  }
 	createData(data){
			if(!fs.existsSync(path.join(plugins_db,this.name)+".json")){
				const db = {
			 			plugin_name:this.name,
			 			db:data
				};
				plugins_dbs.push(db);
				this.b = plugins_dbs.length-1;
				fs.writeFileSync(path.join(plugins_db,this.name)+".json", JSON.stringify(data), function(err) {}); 
				return "created";
			}else{
				return "already_exists";
			}
  }
  getData(){
			return plugins_dbs[this.b].db;
  }
  deleteData(data){
			switch(data){
				case undefined:
					plugins_dbs[b].db = {}; 
					fs.writeFileSync(path.join(plugins_db,this.name)+".json", "{}", function(err) {}); 
				break;
				default:
					const object = this.getData();
					delete object[data];
					fs.writeFileSync(path.join(plugins_db,this.name)+".json",JSON.stringify(object), function(err) {}); 
					plugins_dbs[b].db = object; 
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
 		if(dir_path==undefined) return "not_selected";
 		return dir_path;
 	},
 	currentOS: function(){
 		return process.platform; 
 	},
 	openDevTools: function(){
 		require('electron').remote.getCurrentWindow().toggleDevTools();
 	},
 	zenMode:function(){
 		return current_config.zenMode;
 	},
 	throwError:function(message){
 		new notification("Error detected",message);
 	},
 	dialogAbout: function(){
 		new g_dialog({
	    id:"about",
	    title:current_config.language['About'],
	    content:`
	      ${current_config.language['Version']}: ${g_version.version} (${g_version.date}) - ${g_version.state}
	      <br> ${current_config.language['OS']}: ${graviton.currentOS()}`,
	    buttons:{
	      [current_config.language['Close']]:"closeDialog(this)",
	      [current_config.language['More']]:"openSettings(); goSPage('5');"
	    }
  	})
 	},
 	dialogChangelog: function(){
 		new g_dialog({
	    id:"changelog",
	    title:`${current_config.language['Changelog']} - ${g_version.version}`,
	    content:` 
	    <ul>
	    	<li>Load system's language if it's supported when setuping Graviton </li>
				<li>Updated the website link! www.graviton.ml </li>
				<li>Added scale effect on clicking directories and files in the explorer menu</li>
				<li> Faster startup!</li>
				<li>Faster startup!</li>
		    <li>Added MacOS support</li>
		    <li>Improved stability while editing files</li>
		    <li>Translated to spanish and catalan</li>
		    <li>Deprecated ukranian</li>
		    <li>Added an image viewer integrated</li>
		    <li>Now supports so many languages</li>
		    <li>Fixed throws error when changing font-size with any tab opened</li>
		    <li>Deprecated "Mix" theme</li>
		    <li>Pre-load for some images, to improve the UX</li>
		    <li>Added a changelog dialog</li>
		    <li>Improved settings layout</li>
		    <li>Improved how tabs work</li>
		    <li>Improved Graviton's API</li>
		    <li>Unified window's css</li>
		    <li>Testing a Git plugin which returns you the last commit of your local repo</li>
		    <li>Added building (building.md) instructions</li>
		    <li>Improved Readme.md</li>
		    <li>Improved Setup process</li>
		    <li>Improved auto-completion(unstable)</li>
		    <li>Fixed light theme constrast (remove .graviton and restart to apply)</li>
	    </ul>`,
	    buttons:{
	      [current_config.language['Close']]:"closeDialog(this)"
	    }
  	})
 	}
}
function contextMenu(panel){ //Add buttons to the context menu from the plugin
	Object.keys(panel).forEach(function(key) {
		context_menu_list[key] = panel[key];
	});
}
function floatingWindow([xSize,ySize],content){ //Method to create flaoting windows
	const g_floating_window = document.createElement("div");
	g_floating_window.style.height = ySize+"px";
	g_floating_window.style.width = xSize+"px";
	g_floating_window.classList = "floating_window";
	g_floating_window.innerHTML = content;
	document.body.appendChild(g_floating_window);
}
document.addEventListener('mousedown', function(event){ //Create the context menu
	if(editor_booted===true){
    if (event.button === 2) {
      if(document.getElementById("context_menu")!==null ){
        document.getElementById("context_menu").remove();
      }
      console.log(event.target);
      const context_menu = document.createElement("div");
      const line_space = document.createElement("span");
      line_space.classList = "line_space_menus";
      context_menu.setAttribute("id","context_menu");
      context_menu.style = `left:${event.pageX}px; top:${event.pageY}px`;
    	if(event.target.getAttribute("IamTab")=="true"){
		    Object.keys(context_menu_list_tabs).forEach(function(key,index) {
		    	const button = document.createElement("button");
		        button.classList.add("part_of_context_menu")
		        button.innerText = current_config.language[key];
		        button.setAttribute("target",event.target.id);
	        	context_menu.appendChild(button);
		        button.setAttribute("onclick",context_menu_list_tabs[key]+" document.getElementById('context_menu').remove();");
	    	});
  		}else if(event.target.id!="context_menu"){
      	Object.keys(context_menu_list_text).forEach(function(key,index) {
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
	        button.setAttribute("onclick",context_menu_list_text[key]+" document.getElementById('context_menu').remove();");
		    });
    	}
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
class notification{
	constructor(title,message){
	  if (_notifications.length >= 3) { //Remove one notification in case there are 3
	    _notifications[0].remove();
	    _notifications.splice(0, 1);
	  }
	  const textID = Math.random();
	  const body = document.createElement("div");
	  body.classList.add("notificationBody");
	  body.setAttribute("id", _notifications.length);
	  body.innerHTML =`
	  	<button  onclick="closeNotification(this)">
	      ${close_icon}
	    </button>
	    <h1>${title}</h1>
	    <div>
	      <p id="notification_message${textID}"></p>
	    </div>`;
	  document.getElementById("notifications").appendChild(body);
	  document.getElementById(`notification_message${textID}`).innerText = message;
	  _notifications.push(body);
	  const g_promise = new Promise((resolve, reject) => {
	    const wait = setTimeout(() => {
	      clearTimeout(wait);
	      for (i = 0; i < _notifications.length; i++) {
	        if (_notifications[i] === body) {
	          _notifications.splice(i, 1);
	          body.remove();
	        }
	      }
	    }, 7000); //Wait 7 seconds until the notification auto deletes it selfs
	  });
	  const race = Promise.race([g_promise]);
	}	
}
function closeNotification(element) {
  for (i = 0; i < _notifications.length; i++) {
    if (_notifications[i] === element.parentElement) {
      _notifications.splice(i, 1);
      element.parentElement.remove();
    }
  }
}
function g_dialog(dialogObject){
	if(typeof [...arguments]!="object") {
		graviton.throwError("Parsed argument is not object.")
		return;
	}
  const all = document.createElement("div");
  all.setAttribute("id", dialogObject.id + "_dialog");
  all.setAttribute("style", "-webkit-user-select: none;");
  all.innerHTML=`
  <div myID="${dialogObject.id}" class="opened_window" onclick="closeDialog(this)"></div>
  <div class="dialog_body"></div>`
  const body_dialog = document.createElement("div");
  body_dialog.setAttribute("class", "dialog_body");
  body_dialog.innerHTML =`
  <p style="font-size:25px; line-height:1px; white-space: nowrap; font-weight:bold;">    
  		${dialogObject.title} 
  </p>
  <p style="font-size:15px;">
    	${dialogObject.content}
  </p>`;
  Object.keys(dialogObject.buttons).forEach(function(key,index) {
  	const button = document.createElement("button");
  	button.innerText = key;
  	button.setAttribute("myID",dialogObject.id);
  	button.setAttribute("onclick",dialogObject.buttons[key]);
  	body_dialog.appendChild(button);
  });
  all.appendChild(body_dialog);
  document.body.appendChild(all);
  this.close = function(me){
  	closeDialog(me);
  }
}
const closeDialog =(me)=>{
	document.getElementById(me.getAttribute("myID") + "_dialog").remove();
}
function Window(data){
	this.id = data.id;
	this.code = data.content;
	const newWindow = document.createElement("div");
	newWindow.setAttribute("id",this.id+"_window");
	newWindow.setAttribute("style","-webkit-user-select: none;");
	newWindow.innerHTML = `
	<div class="opened_window" onclick="closeWindow('${this.id}')"></div>
	<div class="body_window" id="body_window">
		<div>${this.code}</div>
	</div>`;
	this.myWindow = newWindow;
	this.launch = function(){
		document.body.appendChild(this.myWindow);
	}
	this.close = function(){
		document.getElementById(`${this.id}_window`).remove();
	}	
}
const closeWindow=id=>{
	document.getElementById(`${id}_window`).remove();
}