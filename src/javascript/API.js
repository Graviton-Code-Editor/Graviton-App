/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const _os = require('os');
const pty = require('node-pty');
let context_menu_list_text = { //Initial value
  "Copy": " document.execCommand('copy');",
  "Paste": " document.execCommand('paste');"
};
const context_menu_list_tabs = {
  "Close": `closeTab(document.getElementById(this.getAttribute("target")).getAttribute("TabID"));`
};
const context_menu_list_directories = {
  "Remove": `directories.removeDialog(document.getElementById(document.getElementById(this.getAttribute('target')).getAttribute('parent_id')));`
};
class Plugin {
  constructor(object) {
    for (i = 0; i < plugins_list.length; i++) {
      if (plugins_list[i].name == object.name) { //List package information
        this.name = plugins_list[i].name;
        this.author = plugins_list[i].author;
        this.version = plugins_list[i].version;
        this.description = plugins_list[i].description;
      }
    }
    for (i = 0; i < plugins_dbs.length; i++) {
      if (plugins_dbs[i].plugin_name == object.name) { //List package information
        this.b = i;
      }
    }
    if (this.name == undefined) {
      console.warn(` Plugin > ${object.name} < doesn't exist `);
      return;
    }
  }
  saveData(data,callback) {
    plugins_dbs[this.b].db = data;
    fs.writeFileSync(path.join(plugins_db, this.name) + ".json", JSON.stringify(data), function(err) {});
    if(!callback==undefined) return callback;
  }
  setData(key, data) {
    if (fs.existsSync(path.join(plugins_db, this.name) + ".json")) {
      let object = this.getData();
      object[key] = data;
      fs.writeFileSync(path.join(plugins_db, this.name) + ".json", JSON.stringify(object), function(err) {
        plugins_dbs[this.b].db = object;
      });
    }
  }
  createData(data) {
    if (!fs.existsSync(path.join(plugins_db, this.name) + ".json")) {
      const db = {
        plugin_name: this.name,
        db: data
      };
      plugins_dbs.push(db);
      this.b = plugins_dbs.length - 1;
      fs.writeFileSync(path.join(plugins_db, this.name) + ".json", JSON.stringify(data), function(err) {});
      return "created";
    } else {
      return "already_exists";
    }
  }
  getData() {
    try {
      return plugins_dbs[this.b].db;
    } catch {
      return null;
    }
  }
  deleteData(data) {
    switch (data) {
      case undefined:
        plugins_dbs[b].db = {};
        fs.writeFileSync(path.join(plugins_db, this.name) + ".json", "{}", function(err) {});
        break;
      default:
        const object = this.getData();
        delete object[data];
        fs.writeFileSync(path.join(plugins_db, this.name) + ".json", JSON.stringify(object), function(err) {});
        plugins_dbs[b].db = object;
    }
  }
}

function dropMenu(obj) {
  this.id = obj.id;
  if (obj != null && obj != undefined) this.translation = obj.translation; //Detect if translation is enabled on the plugin's dropmenu
  this.setList = function(panel) {
    if (document.getElementById(this.id + "_dropbtn") != undefined) {
      const droplist = document.getElementById(this.id + "_dropbtn");
      droplist.innerHTML = ""; //Remove current code and then add the updated one
      droplist.parentElement.children[0].innerText = panel.button;
      droplist.parentElement.children[0].addEventListener("mouseover", function() {
        if (anyDropON) {
          interact_dropmenu(`${this.getAttribute("g_id")}_dropbtn`);
          this.focus();
        }
      }, false);
      let last;
      let toTransx = this.translation;
      Object.keys(panel).forEach(function(attr) {
        if (panel[attr] == panel["list"] && panel["list"] != undefined && last != "list") { //List
          last = "list";
          Object.keys(panel["list"]).forEach(function(key) {
            if (key == "*line") {
              droplist.innerHTML += `<span class="line_space_menus"></span>`;
            } else {
              const icon = typeof panel["list"][key] == "string"? icons.empty:panel["list"][key].icon!=undefined?icons[panel["list"][key].icon]:icons.empty;
              const click = typeof panel["list"][key] == "string"? panel["list"][key]:panel["list"][key].click
              const hint = typeof panel["list"][key] == "string"? "":panel["list"][key].hint
              if (toTransx != true) {
                droplist.innerHTML += `
								<button title="${hint}" onclick="${click}" >
									<div>
									${icon}
									</div>
									<div>${key}</div>
								</button>`
              } else {
                droplist.innerHTML += `
								<button title="${hint}" onclick="${click}" >
									<div>
									${icon}
									</div>
									<div class="translate_word" idT="${key.replace(/ +/g, "")}">
										${key}
									</div>
								</button>`;
              }
            }
          });
        }
        if (panel[attr] == panel["custom"] && panel["custom"] != undefined && last != "custom") { //Custom
          droplist.innerHTML += panel["custom"];
          last = "custom";
        }
      });
    } else {
      const bar = document.getElementById("g_dropmenu_list");
      const newTab = document.createElement("div");
      const droplist = document.createElement("div");
      droplist.classList = "dropdown-content hide";
      droplist.setAttribute("id", this.id + "_dropbtn");
      newTab.classList.add("dropdown");
      if (this.translation != true) {
        newTab.innerHTML = `
				<button g_id="${this.id}" onclick="interact_dropmenu('${this.id}_dropbtn')" class="dropbtn" >${panel["button"]}</button>`
      } else {
        newTab.innerHTML = `
				<button g_id="${this.id}" class=" translate_word dropbtn " idT="${panel["button"].replace(/ +/g, "")}" onclick="interact_dropmenu('${this.id}_dropbtn')"  >${panel["button"]}</button>`
      }
      let last;
      let toTransx = this.translation;
      Object.keys(panel).forEach(function(attr) {
        if (panel[attr] == panel["list"] && panel["list"] != undefined && last != "list") { //List
          last = "list";
          Object.keys(panel["list"]).forEach(function(key) {
            if (panel["list"][key] == "*line" || key == "*line") {
              droplist.innerHTML += `<span class="line_space_menus"></span>`;
            } else {
              const icon = typeof panel["list"][key] == "string"? icons.empty:panel["list"][key].icon!=undefined?icons[panel["list"][key].icon]:icons.empty;
              const click = typeof panel["list"][key] == "string"? panel["list"][key]:panel["list"][key].click
              const hint = typeof panel["list"][key] == "string"? "":panel["list"][key].hint==undefined?"":panel["list"][key].hint;
              if (toTransx != true) {
                droplist.innerHTML += `
                <button title="${hint}" onclick="${click}" >
                  <div>
                  ${icon}
                  </div>
                  <div>${key}</div>
                </button>`
              } else {
                droplist.innerHTML += `
                <button title="${hint}" onclick="${click}" >
                  <div>
                  ${icon}
                  </div>
                  <div class="translate_word" idT="${key.replace(/ +/g, "")}">
                    ${key}
                  </div>
                </button>`;
              }
            }
          });
        }
        if (panel[attr] == panel["custom"] && panel["custom"] != undefined && last != "custom") { //Custom
          droplist.innerHTML += panel["custom"];
          last = "custom";
        }
      });
      newTab.appendChild(droplist);
      bar.appendChild(newTab);
      newTab.children[0].addEventListener("mouseover", function() {
        if (anyDropON != null && anyDropON != (this.getAttribute("g_id") + "_dropbtn")) {
          interact_dropmenu(`${this.getAttribute("g_id")}_dropbtn`);
          this.focus();
        }
      }, false);
    }
  }
}
const graviton = {
  getCurrentTheme: function() { //Get the theme name of the applied theme
    return current_config.theme;
  },
  getSelectedText: function() { //Get te text you have selected
    const selected_text = window.getSelection().toString();
    if (selected_text !== "") {
      return selected_text;
    } else return null; //Returns null if there is not text selected
  },
  setThemeByName: function(name) { //Set a theme by it's name
    return setThemeByName(name);
  },
  getCurrentFile: function() {
    const _file = {
      "path": filepath
    };
    return _file;
  },
  getCurrentEditor: function() {
    for (i = 0; i < editors.length; i++) { //Returns the current selected editor 
      if (editorID == editors[i].id) {
        return editors[i];
      }
    }
    if (editors.length == 0) return "empty";
  },
  getCurrentDirectory: function() {
    if (dir_path == undefined) return "not_selected";
    return dir_path;
  },
  currentOS: function() {
    switch (process.platform) {
      case "win32":
        return {
          codename: process.platform,
          name: "Windows"
        }
        break;
      case "darwin":
        return {
          codename: process.platform,
          name: "MacOS"
        }
        break;
      case "linux":
        return {
          codename: process.platform,
          name: "Linux"
        }
        break;
      default:
        return {
          codename: process.platform,
          name: process.platform
        }
    }
    return;
  },
  openDevTools: function() {
    require('electron').remote.getCurrentWindow().toggleDevTools();
  },
  editorMode: function() {
    return editor_mode;
  },
  throwError: function(message) {
    new Notification("Error ", message);
  },
  dialogAbout: function() {
    new g_dialog({
      id: "about",
      title: current_config.language['About'],
      content: `
	      ${current_config.language['Version']}: ${g_version.version} (${g_version.date}) - ${g_version.state}
	      <br> ${current_config.language['OS']}: ${graviton.currentOS().name}`,
      buttons: {
        [current_config.language['More']]: "Settings.open(); Settings.navigate('5');",
        [current_config.language['Close']]: "closeDialog(this)"

      }
    })
  },
  dialogChangelog: function() {
    fs.readFile(path.join(__dirname, "RELEASE_CHANGELOG.md"), "utf8", function(err, data) {
      new g_dialog({
        id: "changelog",
        title: `${current_config.language['Changelog']} - ${g_version.version}`,
        content: `<div style="padding:2px;">${marked(data)}</div>`,
        buttons: {
          [current_config.language['Close']]: "closeDialog(this)"
        }
      });
    });

  },
  removeScreen: function() {
    let content_editors = "";
    for (i = 0; i < editor_screens.length; i++) {
      content_editors += `
 			<div onclick="if(screens.remove('${editor_screens[i].id}')){this.remove();}  " class="section3" style="width:60px; height:100px; background:var(--accentColor);"></div>
 			`;
    }
    new g_dialog({
      id: "remove_screen",
      title: current_config.language["Dialog.RemoveScreen.title"],
      content: `<div style="overflow: auto;min-width: 100%;height: auto;overflow: auto;white-space: nowrap; display:flex;" >${content_editors}</div>`,
      buttons: {
        [current_config.language['Accept']]: "closeDialog(this)"
      }
    })
  },
  addContextMenu: function(panel) {
    Object.keys(panel).forEach(function(key) {
      context_menu_list_text[key] = panel[key];
    });
  },
  toggleFullScreen: function(status) {
    g_window.setFullScreen(status);
  },
  toggleZenMode: function() {
    if (editor_mode == "zen") {
      editor_mode = "normal";
      document.getElementById("g_explorer").style = "visibility: visible; width:210px; display:block;";
      document.getElementById("g_spacer").style = " display:block;";
    } else {
      editor_mode = "zen";
      document.getElementById("g_explorer").style = "visibility: hidden; width:0px; display:none;";
      document.getElementById("g_spacer").style = " width:0; display:none;";
    }
  },
  deleteLog: function(){
    fs.writeFile(logDir, "[]", (err) => {}); 
  },
  toggleAutoCompletation:function(){ 
    current_config["autoCompletionPreferences"] = current_config["autoCompletionPreferences"] == "activated" ? "desactivated" : "activated";
  },
  toggleLineWrapping: function() {
    if (current_config["lineWrappingPreferences"] == "activated") {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption("lineWrapping", false);
          editors[i].editor.refresh();
        }
      }
      current_config["lineWrappingPreferences"] = "desactivated"
    } else {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          console.log(editors[i].editor);
          editors[i].editor.setOption("lineWrapping", true);
          editors[i].editor.refresh();
        }
      }
      current_config["lineWrappingPreferences"] = "activated"
      console.log(current_config);
    }
  },
  toggleHighlighting: function() {
    if (g_highlighting == "activated") {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption("mode", "text/plain");
          editors[i].editor.refresh();
        }
      }
      g_highlighting = "desactivated";
    } else {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          updateCodeMode(editors[i].editor, path);
        }
      }
      g_highlighting = "activated";
    }
  },
  useSystemAccent: function() {
    if (current_config.accentColorPreferences == "manual") {
      current_config["accentColorPreferences"] = "system";
      try {
        document.documentElement.style.setProperty("--accentColor", "#" + systemPreferences.getAccentColor());
      } catch { //Returns an error = system is not compatible, Linux-based will probably throw that error
        new Notification("Issue", "Your system is not compatible with this feature.")
      }
    } else {
      document.documentElement.style.setProperty("--accentColor", themeObject.Colors.accentColor);
      current_config["accentColorPreferences"] = "manual";
    }
  },
  toggleAnimations() {
    if (current_config.animationsPreferences == "activated") {
      const style = document.createElement("style");
      style.innerText = `*{-webkit-transition: none !important;
          -moz-transition: none !important;
          -o-transition: none !important;
          transition: none !important;
          animation:0;}`;
      style.id = "_ANIMATIONS";
      document.documentElement.style.setProperty("--scalation", "1");
      document.documentElement.appendChild(style);
      current_config.animationsPreferences = "desactivated";
    } else {
      document.getElementById("_ANIMATIONS").remove();
      document.documentElement.style.setProperty("--scalation", "0.98");
      current_config.animationsPreferences = "activated";
    }
  },
  setZoom(_value){
    if(_value >= 0 && _value <= 50){
      current_config.appZoom = _value;
      webFrame.setZoomFactor(current_config.appZoom / 25)
      saveConfig();
    }
  },
  editorSearch(){
    if(editor!=undefined){
      CodeMirror.commands.find(editor)
    }
  },
  editorReplace(){
    if(editor!=undefined){
      CodeMirror.commands.replace(editor)
    }
  },
  editorJumpToLine(){
    if(editor!=undefined){
      CodeMirror.commands.jumpToLine(editor)
    }
  },
  restartApp(){
    remote.app.relaunch()
    remote.app.exit(0)
  },
  isProduction(){
    if(path.basename(__dirname) == 'Graviton-Editor' || path.basename(__dirname) == 'Graviton-App'){
      return false
    }else{
      return true
    }
  },
  resizeTerminals(){
    for(i=0;i<editor_screens.length;i++){
      if(editor_screens[i].terminal !=undefined){
        fit.fit(editor_screens[i].terminal.xterm);
      }
    }
  }
}

function floatingWindow([xSize, ySize], content) { //Method to create flaoting windows
  const g_floating_window = document.createElement("div");
  g_floating_window.style.height = ySize + "px";
  g_floating_window.style.width = xSize + "px";
  g_floating_window.classList = "floating_window";
  g_floating_window.innerHTML = content;
  document.body.appendChild(g_floating_window);
}
document.addEventListener('mousedown', function(event) { //Create the context menu
  if (editor_booted === true) {
    if (event.button === 2) {
      if (document.getElementById("context_menu") !== null) {
        document.getElementById("context_menu").remove();
      }
      const context_menu = document.createElement("div");
      const line_space = document.createElement("span");
      line_space.classList = "line_space_menus";
      context_menu.setAttribute("id", "context_menu");
      context_menu.style = `left:${event.pageX}px; top:${event.pageY}px`;
      switch (event.target.getAttribute("elementType")) {
        case "directorie":
          Object.keys(context_menu_list_directories).forEach(function(key, index) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu")
            button.innerText = current_config.language[key];
            button.setAttribute("target", event.target.id);
            context_menu.appendChild(button);
            button.setAttribute("onclick", context_menu_list_directories[key] + " document.getElementById('context_menu').remove();");
          });
          break;
        case "tab":
          Object.keys(context_menu_list_tabs).forEach(function(key, index) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu")
            button.innerText = current_config.language[key];
            button.setAttribute("target", event.target.id);
            context_menu.appendChild(button);
            button.setAttribute("onclick", context_menu_list_tabs[key] + " document.getElementById('context_menu').remove();");
          });
          break;
        default:
          Object.keys(context_menu_list_text).forEach(function(key, index) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu")
            if (index < 2) {
              button.innerText = current_config.language[key];
              context_menu.appendChild(button);
            } else {
              if (index == 2) {
                context_menu.appendChild(line_space);
              }
              button.innerText = key;
              context_menu.appendChild(button);
            }
            button.setAttribute("onclick", context_menu_list_text[key] + " document.getElementById('context_menu').remove();");
          });
      }
      document.body.appendChild(context_menu);
    } else if (event.button === 0 && !(event.target.matches('#context_menu') || event.target.matches('.part_of_context_menu')) && document.getElementById("context_menu") !== null) {
      document.getElementById("context_menu").remove();
    }
    if (!event.target.matches('.floating_window')) {
      if (document.getElementsByClassName('floating_window').length != 0) {
        for (i = 0; i < document.getElementsByClassName('floating_window').length; i++) {
          document.getElementsByClassName('floating_window')[i].remove();
        }
      }
    }
  }
});
class Notification {
  constructor(title, message) {
    if (_notifications.length >= 3) { //Remove one notification in case there are 3
      _notifications[0].remove();
      _notifications.splice(0, 1);
    }
    const textID = Math.random();
    const body = document.createElement("div");
    body.classList.add("notificationBody");
    body.setAttribute("id", _notifications.length);
    body.innerHTML = `
	  	<button  onclick="closeNotification(this)">
	      ${icons["close"]}
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

function g_dialog(dialogObject) {
  if (typeof [...arguments] != "object") {
    graviton.throwError("Parsed argument is not object.")
    return;
  }
  const all = document.createElement("div");
  all.setAttribute("id", dialogObject.id + "_dialog");
  all.setAttribute("style", "-webkit-user-select: none;");
  all.innerHTML = `
  <div myID="${dialogObject.id}" class="background_window" onclick="closeDialog(this)"></div>`
  const body_dialog = document.createElement("div");
  body_dialog.setAttribute("class", "dialog_body");
  body_dialog.innerHTML = `
  <p style="font-size:21px; line-height:1px; white-space: nowrap; font-weight:bold;">    
  	${dialogObject.title} 
  </p>
  <div style="font-size:15px;">
    ${dialogObject.content}
  </div>
  <div class="buttons"   style="display:flex;"></div>`;
  Object.keys(dialogObject.buttons).forEach(function(key, index) {
    const button = document.createElement("button");
    button.innerText = key;
    button.setAttribute("myID", dialogObject.id);
    if(typeof dialogObject.buttons[key] == "string"){
      button.setAttribute("onclick", dialogObject.buttons[key]);
    }else{
       button.setAttribute("onclick", dialogObject.buttons[key].click);
       button.setAttribute("class", dialogObject.buttons[key].important==true?"important":"");
    }
    
    body_dialog.children[2].appendChild(button);
  });
  all.appendChild(body_dialog);
  document.body.appendChild(all);
  this.close = function(me) {
    closeDialog(me);
  }
}
const closeDialog = id => {
  document.getElementById(id.getAttribute("myID") + "_dialog").remove();
}
class Window {
  constructor(data) {
    this.id = data.id;
    this.code = data.content;
    this.onClose = data.onClose == undefined ? "" : data.onClose;
    const newWindow = document.createElement("div");
    newWindow.setAttribute("id", this.id + "_window");
    newWindow.setAttribute("style", "-webkit-user-select: none;");
    newWindow.innerHTML = `
		<div class="background_window" onclick="closeWindow('${this.id}'); ${this.onClose}"></div>
		<div id="${this.id+"_body"}" class="body_window">
			${this.code}
		</div>`;
    this.myWindow = newWindow;
  }
  launch() {
    document.body.appendChild(this.myWindow);
  }
  close() {
    document.getElementById(`${this.id}_window`).remove();
  }
}
const closeWindow = id => {
  document.getElementById(`${id}_window`).remove();
}
class Tab {
  constructor(object) {
    this.type = object.type;
    this.id = object.id;
    switch (object.type) {
      case "file":
        for (i = 0; i < tabs.length + 1; i++) {
          if (i != tabs.length && tabs[i].getAttribute("longPath") === object.path) {
            loadTab(tabs[i])
            return;
          } else if (i == tabs.length) { //Tab is created because it doesn't exist
            document.getElementById(current_screen.id).children[1].children[0].style = "visibility:hidden; display:none;";
            const tab = document.createElement("div");
            tab.setAttribute("id", object.id + "Tab");
            tab.setAttribute("TabID", object.id + "Tab");
            tab.setAttribute("longPath", object.path);
            tab.setAttribute("screen", current_screen.id);
            tab.setAttribute("class", "tabs");
            tab.setAttribute("elementType", "tab");
            tab.style = `min-width: ${(object.name.length * 4 + 115)}px; 
            max-width: ${(object.name.length * 5 + 100)}px`;
            tab.setAttribute("onclick", "loadTab(this)");
            tab.setAttribute("file_status", "saved");
            tab.innerHTML += `<p id="${object.id + "TextTab"}" TabID="${object.id}Tab" elementType="tab">${object.name}</p>`
            const tab_x = document.createElement("button");
            tab_x.setAttribute("onclose", `closeTab("${ object.id }Tab",true);`);
            tab_x.setAttribute("onclick", `closeTab("${ object.id }Tab",false);`);
            tab_x.setAttribute("class", "close_tab");
            tab_x.setAttribute("hovering", "false");
            tab_x.setAttribute("elementType", "tab");
            tab_x.setAttribute("TabID", object.id + "Tab");
            tab_x.setAttribute("id", object.id + "CloseButton");
            tab_x.innerHTML = icons["close"];
            tab_x.addEventListener("mouseover", function(e) {
              this.setAttribute("hovering", true);
            });
            tab_x.addEventListener("mouseout", function(e) {
              this.setAttribute("hovering", false);
            });
            tab.appendChild(tab_x);
            document.getElementById(current_screen.id).children[0].appendChild(tab);
            tabs.push(tab);
            const g_newPath = object.path;
            filepath = g_newPath;
            const tab_created_event = new CustomEvent("tab_created",{
              detail:{
                tab : tab
              }
            })
            document.dispatchEvent(tab_created_event);
            switch (filepath.split(".").pop()) {
              case "svg":
              case "png":
              case "ico":
              case "jpg":
                for (i = 0; i < tabs.length; i++) {
                  if (tabs[i].getAttribute("screen") == current_screen.id && tabs[i].classList.contains("selected")) {
                    tabs[i].classList.remove("selected");
                  }
                }
                tab.classList.add("selected");
                tab.setAttribute("typeEditor", "text");
                editingTab = tab.id;
                loadEditor({
                  type: "image",
                  dir: filepath,
                  data: null,
                  screen: current_screen.id
                });
                break;
              default:
                fs.readFile(g_newPath, "utf8", function(err, data) {
                  if (err) return console.error(err);
                  tab.setAttribute("data", data);
                  for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].getAttribute("screen") == current_screen.id && tabs[i].classList.contains("selected")) {
                      tabs[i].classList.remove("selected");
                    }
                  }
                  tab.classList.add("selected");
                  tab.setAttribute("typeEditor", "text");
                  editingTab = tab.id;
                  loadEditor({
                    type: "text",
                    dir: g_newPath,
                    data: data,
                    screen: current_screen.id
                  });

                  editor.refresh();
                });
            }
            return;
          }
        }
        break;
      case "free":
        for (i = 0; i < tabs.length; i++) {
          if (tabs[i].getAttribute("screen") == current_screen.id && tabs[i].classList.contains("selected")) {
            tabs[i].classList.remove("selected");
          }
        }
        document.getElementById(current_screen.id).children[1].children[0].style = "visibility:hidden; display:none;";
        const tab = document.createElement("div");
        tab.setAttribute("data", object.data);
        tab.setAttribute("id", object.id + "Tab");
        tab.setAttribute("TabID", object.id + "Tab");
        tab.setAttribute("screen", current_screen.id);
        tab.setAttribute("class", "tabs selected");
        tab.setAttribute("longPath", object.id);
        tab.setAttribute("typeEditor", "free");
        tab.setAttribute("elementType", "tab");
        tab.style = `min-width: ${(object.name.length * 4 + 115)}px; 
        max-width: ${(object.name.length * 5 + 100)}px`;
        tab.setAttribute("onclick", "loadTab(this)");
        tab.setAttribute("file_status", "saved");
        tab.innerHTML += `<p id="${object.id + "TextTab"}" TabID="${object.id}Tab" elementType="tab">${object.name}</p>`
        const tab_x = document.createElement("button");
        tab_x.setAttribute("onclick", `closeTab("${ object.id }Tab");`);
        tab_x.setAttribute("class", "close_tab");
        tab_x.setAttribute("hovering", "false");
        tab_x.setAttribute("elementType", "tab");
        tab_x.setAttribute("TabID", object.id + "Tab");
        tab_x.setAttribute("id", object.id + "CloseButton");
        tab_x.innerHTML = icons["close"];
        tab_x.addEventListener("mouseover", function(e) {
          this.setAttribute("hovering", true);
        });
        tab_x.addEventListener("mouseout", function(e) {
          this.setAttribute("hovering", false);
        });
        tab.appendChild(tab_x);
        document.getElementById(current_screen.id).children[0].appendChild(tab);
        tabs.push(tab);
        const tab_created_event = new CustomEvent("tab_created",{
          detail:{
            tab : tab
          }
        })
        document.dispatchEvent(tab_created_event);
        loadEditor({
          type: "free",
          dir: object.id,
          data: object.data,
          screen: current_screen.id
        });
        filepath = undefined;
        editingTab = object.id;
        break;
    }
  }
  setData(data) {
    if (this.type == "free") {
      document.getElementById(this.id + "_editor").innerHTML = data;
    }
  }
}

const closeTab = (tab_id, fromWarn) => {
  const g_object = document.getElementById(tab_id);
  if (g_object.getAttribute("file_status") == "saved" || fromWarn) {
    for (i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      let new_selected_tab;
      if (tab.id == tab_id && tab.getAttribute("screen") == g_object.getAttribute("screen")) {
        tabs.splice(i, 1);
        document
          .getElementById(g_object.getAttribute("longPath").replace(/\\/g, "") + "_editor")
          .remove();
        editors.splice(i, 1);
        const tab_closed_event = new CustomEvent("tab_closed",{
            detail:{
              tab: g_object
            }
          })
        document.dispatchEvent(tab_closed_event);
        let tabs2 = [];
        for (i = 0; i < tabs.length; i++) {
          if (tabs[i].getAttribute("screen") == g_object.getAttribute("screen")) {
            tabs2.push(tabs[i]);
          }
        }
        if (tabs2.length == 0) { //Any tab opened
          filepath = " ";
          plang = "";
          document.getElementById(g_object.getAttribute("screen")).children[2].children[0].innerText = plang;
          document.getElementById(g_object.getAttribute("screen")).children[1].children[0].style = "visibility:visible; display:block;"
        } else if (i === tabs2.length) { //Last tab selected
          for (i = 0; i < tabs2.length; i++) {
            if (tabs2[i].getAttribute("screen") == g_object.getAttribute("screen")) {
              new_selected_tab = tabs2[Number(tabs2.length) - 1];
            }
          }
        } else {
          for (i = 0; i < tabs2.length; i++) {
            if (tabs2[i].getAttribute("screen") == g_object.getAttribute("screen")) {
              new_selected_tab = tabs2[i];
            }
          }
        }
        if (new_selected_tab != undefined) {
          for (i = 0; i < tabs.length; i++) {
            if (tabs[i].classList.contains("selected") && tabs[i].getAttribute("screen") == g_object.getAttribute("screen")) {
              tabs[i].classList.remove("selected");
            }
          }
          editingTab = new_selected_tab.id;
          new_selected_tab.classList.add("selected");
          const g_newPath = new_selected_tab.getAttribute("longpath");
          filepath = g_newPath;
          loadEditor({
            type: new_selected_tab.getAttribute("typeeditor"),
            dir: g_newPath,
            data: new_selected_tab.getAttribute("data"),
            screen: new_selected_tab.getAttribute("screen")
          });
          
        }
        g_object.remove();
      }
    }
  } else {
    save_file_warn(g_object.children[1]);
    return;
  }
}
const loadTab = object => {
  const object_screen = object.getAttribute("screen");
  if (object.id != editingTab && object.children[1].getAttribute("hovering") == "false") {
    for (i = 0; i < tabs.length; i++) {
      if (tabs[i].classList.contains("selected") && tabs[i].getAttribute("screen") == object_screen) {
        tabs[i].classList.remove("selected");
      }
    }
    const tab_loaded_event = new CustomEvent("tab_loaded",{
        detail:{
          tab: object
        }
      })
    document.dispatchEvent(tab_loaded_event);
    object.classList.add("selected");
    const g_newPath = object.getAttribute("longpath");
    filepath = g_newPath
    loadEditor({
      type: object.getAttribute("typeeditor"),
      dir: g_newPath,
      data: object.getAttribute("data"),
      screen: object.getAttribute("screen")
    });
    editingTab = object.id;
  }
}
class commander {
  constructor(object,callback) {
    if(document.getElementById(current_screen.id).children[3]!=undefined) {
      return callback(true)
    }
    this.id = object.id + "_commander";
    this.content = object.content;
    const commanderObj = document.createElement("div");
    commanderObj.id = this.id;
    commanderObj.classList = "commander";
    commanderObj.innerHTML = object.content;
    document.getElementById(current_screen.id).appendChild(commanderObj);
    return callback(false);
  }
  close() {
    document.getElementById(this.id + "_commander").remove();
  }
}
const commanders = {
  ask: function(object) {
    new commander({
      id: "commander_ask",
      content: `
      <div class="section-b">
	      <div style="display:flex; ">
	      	<p style="flex:70%;">${object.message}</p>
	      	<button class="button2"  onclick="commanders.close('commander_ask');">Close</button>
	      </div>
	      <input style="margin-top:4px;" class="input1 auto"></input>
      </div>`
    })
  },
  terminal: function(object) {
    if(graviton.getCurrentDirectory()=="not_selected") {
      new Notification("Error",current_config.language["CannotRunTerminalCauseDirectory"]);
      return;
    }
    const randomID= Math.random();
    new commander({
      id:"xterm"+randomID,
      content:""
    },function(err){
        if(!err){
          const shell = process.env[_os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
          const ptyProcess = pty.spawn(shell, [], {
            cwd: graviton.getCurrentDirectory(),
            env: process.env,
          });
          const xterm = new Terminal({
            rows:"10",
            theme:{
              background:graviton.getCurrentTheme().Colors["editor-background-color"],
              foreground:graviton.getCurrentTheme().Colors["white-black"]
            }
          });
          //
          xterm.open(document.getElementById("xterm"+randomID+"_commander"));  
          xterm.on('data', (data) => {
            ptyProcess.write(data);
          });
          ptyProcess.on('data', function (data) {
            xterm.write(data);
          });
          xterm
          for(i=0;i<editor_screens.length;i++){
            if(editor_screens[i].id==current_screen.id){
              editor_screens[i].terminal = {id:"xterm"+randomID,xterm:xterm};
              current_screen.terminal = editor_screens[i].terminal;
              const new_terminal_event = new CustomEvent("new_terminal",{
                detail:{
                  terminal: current_screen.terminal
                }
              })
              document.dispatchEvent(new_terminal_event); 
              return;
            }
          }  
          
        }
     }) 
  },
  close: function(id) {
    document.getElementById(id + "_commander").remove();
  },
  closeTerminal: function(){
    for(i=0;i<editor_screens.length;i++){
      if(editor_screens[i].id==current_screen.id){
        const closed_terminal_event = new CustomEvent("closed_terminal",{
          detail:{
            terminal:  editor_screens[i].terminal
          }
        })
        document.dispatchEvent(closed_terminal_event);
        editor_screens[i].terminal.xterm.destroy();
        editor_screens[i].terminal = undefined;
        commanders.close(current_screen.terminal.id);
        current_screen.terminal = undefined;
      }
    } 

  }
}
const screens = {
  add: function () {
    const current_id = `screen_${editor_screens.length + Math.random()}`
    const new_screen_editor = document.createElement('div')
    new_screen_editor.classList = 'g_editors'
    new_screen_editor.id = current_id
    new_screen_editor.innerHTML = `
       <div class="g_tabs_bar flex smallScrollBar"></div>  
        
        <div class="g_editors_editors" >
        <p class="translate_word temp_dir_message" idT="WelcomeMessage" >${current_config.language['WelcomeMessage']}</p>
        </div>
        <div class="g_status_bar" >
          <p></p>
        </div>`
    document.getElementById('g_content').insertBefore(new_screen_editor, document.getElementById('g_content').children[document.getElementById('g_content').children.length - 1])
    current_screen = { id: current_id, terminal: undefined }
    const screen = {
      id:current_screen.id,
      terminal:undefined
    }
    editor_screens.push(screen);
    new_screen_editor.addEventListener('click', function (event) {
      for(i=0;i<editor_screens.length;i++){
        if(editor_screens[i].id==this.id){
          current_screen.id = this.id;
          current_screen.terminal = editor_screens[i].terminal;
        }
      }   
      
    }, false)
    const split_screen_event = new CustomEvent("split_screen",{
      detail:{
        screen : current_screen
      }
    })
    document.dispatchEvent(split_screen_event);
  },
  remove: function (id) {
    if (editor_screens.length != 1) {
      for (i = 0; i < editor_screens.length; i++) {
        if (editor_screens[i].id == id) {
          let tabs2 = []
          for (b = 0; b < tabs.length; b++) {
            if (tabs[b].getAttribute('screen') == id) {
              tabs2.push(tabs[b])
            }
          }
          if (tabs2.length == 0) {
            if (editor_screens[i].terminal != undefined) {
              editor_screens[i].terminal.xterm.destroy()
              commander.close(editor_screens[i].terminal.id)
              editor_screens[i].terminal = undefined;
            }
            const closed_screen_event = new CustomEvent("closed_screen",{
              detail:{
                screen : editor_screens[i]
              }
            })
            document.dispatchEvent(closed_screen_event);
            document.getElementById(id).remove()
            editor_screens.splice(i, 1)
            editors.splice(i, 1)
            current_screen = {id:editor_screens[editor_screens.length - 1].id , terminal:editor_screens[editor_screens.length - 1].terminal};
            return true
          } else {
            graviton.throwError(current_config.language['Notification.CloseAllTabsBefore'])
            return false
          }
          return
        }
      }
    } else {
      graviton.throwError(current_config.language['Notification.CannotRemoveMoreScreens'])
      return false
    }
  },
  default: function () {
    for (i = 0; i < editor_screens.length; i++) {
      if (i != 0) {
        let tabs2 = []
        const number = i
        for (b = 0; b < tabs.length; b++) {
          if (tabs[b].getAttribute('screen') == editor_screens[number].id) {
            tabs2.push(tabs[b])
          }
        }
        if (tabs2.length == 0) {
          if (editor_screens[number].terminal != undefined) {
            editor_screens[number].terminal.xterm.destroy()
            commanders.close(editor_screens[number].terminal.id)
            editor_screens[i].terminal = undefined;
          }
          document.getElementById(editor_screens[number].id).remove()
          editor_screens.splice(number, 1)
          editors.splice(number, 1)
          current_screen = {id:editor_screens[editor_screens.length - 1].id , terminal:editor_screens[editor_screens.length - 1].terminal};
          i--
        } else {
          graviton.throwError(current_config.language['Notification.CloseAllTabsBefore'])
        }
      }
    }
  }
}
window.onresize = function(){ graviton.resizeTerminals();}