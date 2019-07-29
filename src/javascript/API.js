/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const _os = require("os");
const pty = require("node-pty");
const path = require("path");
const { Dialog, closeDialog } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "controls",
    "dialogs.js"
  )),
  { Window, closeWindow } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "controls",
    "windows.js"
  )),
  { Notification, closeNotification } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "controls",
    "notifications.js"
  )),
  { Tab, closeTab, loadTab } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "controls",
    "tabs.js"
  ));
let { icons } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "icons.js"
));

let menus_showing = true;
let context_menu_list_text = {
  //Initial value
  Copy: () => {
    document.execCommand("copy");
  },
  Paste: () => {
    document.execCommand("paste");
  }
};
const context_menu_list_tabs = {
  Close: function() {
    closeTab(
      document.getElementById(this.getAttribute("target")).getAttribute("TabID")
    );
  }
};
const context_menu_list_directories = {
  Remove: function() {
    directories.removeFileDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute("target"))
          .getAttribute("parent")
      )
    );
  }
};
const context_menu_directory_options = {
  Reload: function() {
    loadDirs(
      document.getElementById(this.getAttribute("target")).getAttribute("dir"),
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("parent"),
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("global")
    );
  },
  NewFolder:function(){
    directories.newFolder(document.getElementById(this.getAttribute("target")).getAttribute("parent"));
  },
  NewFile:function(){
    directories.newFile(document.getElementById(this.getAttribute("target")).getAttribute("parent"));
  },
  Remove: function() {
    directories.removeFolderDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute("target"))
          .getAttribute("parent")
      )
    );
  }
};
class Plugin {
  constructor(object) {
    for (i = 0; i < plugins_list.length; i++) {
      if (plugins_list[i].name == object.name) {
        //List package information
        this.name = plugins_list[i].name;
        this.author = plugins_list[i].author;
        this.version = plugins_list[i].version;
        this.description = plugins_list[i].description;
      }
    }
    for (i = 0; i < plugins_dbs.length; i++) {
      if (plugins_dbs[i].plugin_name == object.name) {
        //List package information
        this.b = i;
      }
    }
    if (this.name == undefined) {
      console.warn(` Plugin > ${object.name} < doesn't exist `);
      return;
    }
  }
  saveData(data, callback) {
    plugins_dbs[this.b].db = data;
    fs.writeFileSync(
      path.join(plugins_db, this.name) + ".json",
      JSON.stringify(data),
      function(err) {}
    );
    if (!callback == undefined) return callback;
  }
  setData(key, data) {
    if (fs.existsSync(path.join(plugins_db, this.name) + ".json")) {
      let object = this.getData();
      object[key] = data;
      fs.writeFileSync(
        path.join(plugins_db, this.name) + ".json",
        JSON.stringify(object),
        function(err) {
          plugins_dbs[this.b].db = object;
        }
      );
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
      fs.writeFileSync(
        path.join(plugins_db, this.name) + ".json",
        JSON.stringify(data),
        function(err) {}
      );
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
        fs.writeFileSync(
          path.join(plugins_db, this.name) + ".json",
          "{}",
          function(err) {}
        );
        break;
      default:
        const object = this.getData();
        delete object[data];
        fs.writeFileSync(
          path.join(plugins_db, this.name) + ".json",
          JSON.stringify(object),
          function(err) {}
        );
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
      droplist.parentElement.children[0].addEventListener(
        "mouseover",
        function() {
          if (anyDropON) {
            interact_dropmenu(`${this.getAttribute("g_id")}_dropbtn`);
            this.focus();
          }
        },
        false
      );
      let last;
      let toTransx = this.translation;
      Object.keys(panel).forEach(function(attr) {
        if (
          panel[attr] == panel["list"] &&
          panel["list"] != undefined &&
          last != "list"
        ) {
          //List
          last = "list";
          Object.keys(panel["list"]).forEach(function(key) {
            if (key == "*line") {
              droplist.innerHTML += `<span class="line_space_menus"></span>`;
            } else {
              const icon =
                typeof panel["list"][key] == "string"
                  ? icons.empty
                  : panel["list"][key].icon != undefined
                  ? icons[panel["list"][key].icon]
                  : icons.empty;
              const click =
                typeof panel["list"][key] == "string"
                  ? panel["list"][key]
                  : panel["list"][key].click;
              const hint =
                typeof panel["list"][key] == "string"
                  ? ""
                  : panel["list"][key].hint;
              const button = document.createElement("button");
              button.setAttribute("title", hint);
              button.id = Math.random();
              sleeping(1).then(() => {
                if(document.getElementById(button.id)==null) return;
                document.getElementById(button.id).onclick = click;
              });
              if (toTransx != true) {
                button.innerHTML += `
									<div>
									${icon}
									</div>
									<div>${key}</div>`;
              } else {
                button.innerHTML += `
									<div>
									${icon}
									</div>
									<div class="translate_word" idT="${key.replace(/ +/g, "")}">
										${key}
									</div>`;
              }
              droplist.appendChild(button);
            }
          });
        }
        if (
          panel[attr] == panel["custom"] &&
          panel["custom"] != undefined &&
          last != "custom"
        ) {
          //Custom
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
				<button g_id="${this.id}" onclick="interact_dropmenu('${
          this.id
        }_dropbtn')" class="dropbtn" >${panel["button"]}</button>`;
      } else {
        newTab.innerHTML = `
				<button g_id="${this.id}" class=" translate_word dropbtn " idT="${panel[
          "button"
        ].replace(/ +/g, "")}" onclick="interact_dropmenu('${
          this.id
        }_dropbtn')"  >${panel["button"]}</button>`;
      }
      let last;
      let toTransx = this.translation;
      Object.keys(panel).forEach(function(attr) {
        if (
          panel[attr] == panel["list"] &&
          panel["list"] != undefined &&
          last != "list"
        ) {
          //List
          last = "list";
          Object.keys(panel["list"]).forEach(function(key) {
            if (panel["list"][key] == "*line" || key == "*line") {
              droplist.innerHTML += `<span class="line_space_menus"></span>`;
            } else {
              const icon =
                typeof panel["list"][key] == "string"
                  ? icons.empty
                  : panel["list"][key].icon != undefined
                  ? icons[panel["list"][key].icon]
                  : icons.empty;
              const click =
                typeof panel["list"][key] == "function"
                  ? panel["list"][key]
                  : panel["list"][key].click;
              const hint =
                typeof panel["list"][key] == "string"
                  ? ""
                  : panel["list"][key].hint == undefined
                  ? ""
                  : panel["list"][key].hint;
              const button = document.createElement("button");
              button.setAttribute("title", hint);
              button.id = Math.random();
              sleeping(1).then(() => {
                document.getElementById(button.id).onclick = click;
              });
              if (toTransx != true) {
                button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div>${key}</div>
                  `;
              } else {
                button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div class="translate_word" idT="${key.replace(/ +/g, "")}">
                      ${key}
                    </div>
                  `;
              }
              droplist.appendChild(button);
            }
          });
        }
        if (
          panel[attr] == panel["custom"] &&
          panel["custom"] != undefined &&
          last != "custom"
        ) {
          //Custom
          droplist.innerHTML += panel["custom"];
          last = "custom";
        }
      });
      newTab.appendChild(droplist);
      bar.appendChild(newTab);
      newTab.children[0].addEventListener(
        "mouseover",
        function() {
          if (
            anyDropON != null &&
            anyDropON != this.getAttribute("g_id") + "_dropbtn"
          ) {
            interact_dropmenu(`${this.getAttribute("g_id")}_dropbtn`);
            this.focus();
          }
        },
        false
      );
    }
  };
}

function sleeping(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const graviton = {
  getCurrentTheme: function() {
    //Get the theme name of the applied theme
    return current_config.theme;
  },
  getSelectedText: function() {
    //Get te text you have selected
    const selected_text = window.getSelection().toString();
    if (selected_text !== "") {
      return selected_text;
    } else return null; //Returns null if there is not text selected
  },
  setThemeByName: function(name) {
    //Set a theme by it's name
    return setThemeByName(name);
  },
  getCurrentFile: function() {
    const _file = {
      path: filepath
    };
    return _file;
  },
  getCurrentEditor: function() {
    for (i = 0; i < editors.length; i++) {
      //Returns the current selected editor
      if (editorID == editors[i].id) {
        return editors[i];
      }
    }
    if (editors.length == 0) return null;
  },
  getCurrentDirectory: function() {
    if (dir_path == undefined) return null;
    return dir_path;
  },
  currentOS: function() {
    switch (process.platform) {
      case "win32":
        return {
          codename: process.platform,
          name: "Windows"
        };
        break;
      case "darwin":
        return {
          codename: process.platform,
          name: "MacOS"
        };
        break;
      case "linux":
        return {
          codename: process.platform,
          name: "Linux"
        };
        break;
      default:
        return {
          codename: process.platform,
          name: process.platform
        };
    }
    return;
  },
  openDevTools: function() {
    require("electron")
      .remote.getCurrentWindow()
      .toggleDevTools();
  },
  editorMode: function() {
    return editor_mode;
  },
  throwError: function(message) {
    new Notification("Error ", message);
  },
  dialogAbout: function() {
    new Dialog({
      id: "about",
      title: current_config.language["About"],
      content: `
	      ${current_config.language["Version"]}: ${g_version.version} (${
        g_version.date
      }) - ${g_version.state}
	      <br> ${current_config.language["OS"]}: ${graviton.currentOS().name}`,
      buttons: {
        [current_config.language["More"]]: {
          click: ()=>{
            Settings.open(); Settings.navigate('5')
          },
          important: true
        },
        [current_config.language["Close"]]: {}
      }
    });
  },
  dialogChangelog: function() {
    fs.readFile(path.join(__dirname, "RELEASE_CHANGELOG.md"), "utf8", function(
      err,
      data
    ) {
      new Dialog({
        id: "changelog",
        title: `${current_config.language["Changelog"]} - ${g_version.version}`,
        content: `<div style="padding:2px;">${marked(data)}</div>`,
        buttons: {
          [current_config.language["Close"]]: {}
        }
      });
    });
  },
  removeScreen: function() {
    let content_editors = "";
    for (i = 0; i < editor_screens.length; i++) {
      content_editors += `
 			<div onclick="if(screens.remove('${
        editor_screens[i].id
      }')){this.remove();}  " class="section-3" style="width:60px; height:100px; background:var(--accentColor);"></div>
 			`;
    }
    new Dialog({
      id: "remove_screen",
      title: current_config.language["Dialog.RemoveScreen.title"],
      content: `<div style="overflow: auto;min-width: 100%;height: auto;overflow: auto;white-space: nowrap; display:flex;" >${content_editors}</div>`,
      buttons: {
        [current_config.language["Accept"]]: {}
      }
    });
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
      document.getElementById("g_explorer").style =
        "visibility: visible; width:210px; display:block;";
      document.getElementById("g_spacer").style = " display:block;";
    } else {
      editor_mode = "zen";
      document.getElementById("g_explorer").style =
        "visibility: hidden; width:0px; display:none;";
      document.getElementById("g_spacer").style = " width:0; display:none;";
    }
  },
  deleteLog: function() {
    fs.writeFile(logDir, "[]", err => {});
  },
  toggleAutoCompletation: function() {
    current_config["autoCompletionPreferences"] =
      current_config["autoCompletionPreferences"] == "activated"
        ? "desactivated"
        : "activated";
  },
  toggleLineWrapping: function() {
    if (current_config["lineWrappingPreferences"] == "activated") {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption("lineWrapping", false);
          editors[i].editor.refresh();
        }
      }
      current_config["lineWrappingPreferences"] = "desactivated";
    } else {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          console.log(editors[i].editor);
          editors[i].editor.setOption("lineWrapping", true);
          editors[i].editor.refresh();
        }
      }
      current_config["lineWrappingPreferences"] = "activated";
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
        document.documentElement.style.setProperty(
          "--accentColor",
          "#" + systemPreferences.getAccentColor()
        );
        document.documentElement.style.setProperty(
          "--accentDarkColor",
          tinycolor(systemPreferences.getAccentColor())
            .darken()
            .toString()
        );
        document.documentElement.style.setProperty(
          "--accentLightColor",
          tinycolor(systemPreferences.getAccentColor())
            .brighten()
            .toString()
        );
      } catch {
        //Returns an error = system is not compatible, Linux-based will probably throw that error
        new Notification(
          "Issue",
          "Your system is not compatible with this feature."
        );
      }
    } else {
      document.documentElement.style.setProperty(
        "--accentColor",
        themeObject.colors.accentColor
      );
      document.documentElement.style.setProperty(
        "--accentDarkColor",
        themeObject.colors.accentDarkColor
      );
      document.documentElement.style.setProperty(
        "--accentLightColor",
        themeObject.colors.accentLightColor
      );
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
  setZoom(_value) {
    if (_value >= 0 && _value <= 50) {
      current_config.appZoom = _value;
      webFrame.setZoomFactor(current_config.appZoom / 25);
      saveConfig();
    }
  },
  editorSearch() {
    if (editor != undefined) {
      CodeMirror.commands.find(editor);
    }
  },
  editorReplace() {
    if (editor != undefined) {
      CodeMirror.commands.replace(editor);
    }
  },
  editorJumpToLine() {
    if (editor != undefined) {
      CodeMirror.commands.jumpToLine(editor);
    }
  },
  restartApp() {
    remote.app.relaunch();
    remote.app.exit(0);
  },
  isProduction() {
    if (
      path.basename(__dirname) == "Graviton-Editor" ||
      path.basename(__dirname) == "Graviton-App"
    ) {
      return false;
    } else {
      return true;
    }
  },
  resizeTerminals() {
    for (i = 0; i < editor_screens.length; i++) {
      if (editor_screens[i].terminal != undefined) {
        fit.fit(editor_screens[i].terminal.xterm);
      }
    }
  },
  toggleFullScreen() {
    if (graviton.isProduction()) {
      if (g_window.isFullScreen() == false) {
        g_window.setFullScreen(true);
      } else {
        g_window.setFullScreen(false);
      }
    }
  },
  toggleMenus() {
    if (menus_showing == true) {
      document.getElementById("g_dropmenu_list").style =
        "visibility:hidden; width:0;";
      menus_showing = false;
    } else {
      document.getElementById("g_dropmenu_list").style = "";
      menus_showing = true;
    }
  },
  getPlugin: function(folder_name) {
    for (i = 0; i < full_plugins.length; i++) {
      if (full_plugins[i].package.folder == folder_name) {
        return {
          repo: full_plugins[i],
          local: (function() {
            for (let a = 0; a < plugins_list.length; a++) {
              if (plugins_list[a].folder == folder_name) {
                return plugins_list[a];
              }
            }
            return undefined;
          })(),
          database:(function(){
            for (let a = 0; a < plugins_dbs.length; a++) {
              if (plugins_dbs[a].plugin_name == folder_name) {
                return plugins_dbs[a].db;
              }
            }
            return undefined;
          })()
        };
      }
    }
    for (let a = 0; a < plugins_list.length; a++) {
      if (plugins_list[a].folder == folder_name) {
        return {
          local: plugins_list[a],
          repo: undefined
        };
      }
    }
  },
  windowContent(id, content) {
    document.getElementById(`${id}_body`).innerHTML = content;
  },
  toggleBounceEffect(){
    if(current_config.bouncePreferences == "activated"){
      current_config.bouncePreferences = "desactivated"
    }else{
      current_config.bouncePreferences = "activated"
    }
  }
};

function floatingWindow([xSize, ySize], content) {
  //Method to create flaoting windows
  const g_floating_window = document.createElement("div");
  g_floating_window.style.height = ySize + "px";
  g_floating_window.style.width = xSize + "px";
  g_floating_window.classList = "floating_window";
  g_floating_window.innerHTML = content;
  document.body.appendChild(g_floating_window);
}
document.addEventListener("mousedown", function(event) {
  if (editor_booted === true) {
    if (event.button === 2) {
      if (document.getElementById("context_menu") !== null) {
        document.getElementById("context_menu").remove();
      }
      const context_menu = document.createElement("div");
      const line_space = document.createElement("span");
      line_space.classList = "line_space_menus";
      context_menu.setAttribute("id", "context_menu");
      context_menu.style = `left:${event.pageX + 1}px; top:${event.pageY +
        1}px`;
      switch (event.target.getAttribute("elementType")) {
        case "directorie":
          Object.keys(context_menu_list_directories).forEach(function(
            key,
            index
          ) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu");
            button.innerText = current_config.language[key];
            button.setAttribute("target", event.target.id);
            context_menu.appendChild(button);
            sleeping(1).then(() => {
              button.onclick = context_menu_list_directories[key];
            });
          });
          break;
        case "tab":
          Object.keys(context_menu_list_tabs).forEach(function(key, index) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu");
            button.innerText = current_config.language[key];
            button.setAttribute("target", event.target.id);
            context_menu.appendChild(button);
            sleeping(1).then(() => {
              button.onclick = context_menu_list_tabs[key];
            });
          });
          break;
        case "directory":
          Object.keys(context_menu_directory_options).forEach(function(
            key,
            index
          ) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu");
            button.innerText = getTranslation(key);
            button.setAttribute("target", event.target.id);
            context_menu.appendChild(button);
            sleeping(1).then(() => {
              button.onclick = context_menu_directory_options[key];
            });
          });
          break;
        default:
          Object.keys(context_menu_list_text).forEach(function(key, index) {
            const button = document.createElement("button");
            button.classList.add("part_of_context_menu");
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
            sleeping(1).then(() => {
              button.onclick = context_menu_list_text[key];
            });
          });
      }
      document.body.appendChild(context_menu);
    } else if (
      event.button === 0 &&
      !(
        event.target.matches("#context_menu") ||
        event.target.matches(".part_of_context_menu")
      ) &&
      document.getElementById("context_menu") !== null
    ) {
      document.getElementById("context_menu").remove();
    }
    if (!event.target.matches(".floating_window")) {
      if (document.getElementsByClassName("floating_window").length != 0) {
        for (
          i = 0;
          i < document.getElementsByClassName("floating_window").length;
          i++
        ) {
          document.getElementsByClassName("floating_window")[i].remove();
        }
      }
    }
  }
});

class commander {
  constructor(object, callback) {
    if (document.getElementById(current_screen.id).children[3] != undefined) {
      return callback(true);
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
    document.getElementById(this.id).remove();
  }
  hide() {
    document.getElementById(this.id).style.display = "none";
  }
  show() {
    document.getElementById(this.id).style = "";
  }
}
const commanders = {
  terminal: function(object) {
    if (graviton.getCurrentDirectory() == null && object == undefined) {
      new Notification(
        "Error",
        current_config.language["CannotRunTerminalCauseDirectory"]
      );
      return;
    }
    const randomID = Math.random();
    new commander(
      {
        id: "xterm" + randomID,
        content: ""
      },
      function(err) {
        if (!err) {
          const shell =
            process.env[_os.platform() === "win32" ? "COMSPEC" : "SHELL"];
          const ptyProcess = pty.spawn(shell, [], {
            cwd:
              object == undefined
                ? graviton.getCurrentDirectory()
                : object.path,
            env: process.env
          });
          const xterm = new Terminal({
            rows: "10",
            theme: {
              background: graviton.getCurrentTheme().colors[
                "editor-background-color"
              ],
              foreground: graviton.getCurrentTheme().colors["white-black"]
            }
          });
          //
          xterm.open(
            document.getElementById("xterm" + randomID + "_commander")
          );
          xterm.on("data", data => {
            ptyProcess.write(data);
          });
          ptyProcess.on("data", function(data) {
            xterm.write(data);
          });
          graviton.resizeTerminals();
          for (i = 0; i < editor_screens.length; i++) {
            if (editor_screens[i].id == current_screen.id) {
              editor_screens[i].terminal = {
                id: "xterm" + randomID,
                xterm: xterm
              };
              current_screen.terminal = editor_screens[i].terminal;
              const new_terminal_event = new CustomEvent("new_terminal", {
                detail: {
                  terminal: current_screen.terminal
                }
              });
              document.dispatchEvent(new_terminal_event);
              graviton.resizeTerminals();
              return;
            }
          }
        }
      }
    );
  },
  hide: function(id) {
    document.getElementById(id + "_commander").style.display = "none";
  },
  show: function(id) {
    document.getElementById(id + "_commander").style = "";
  },
  close: function(id) {
    document.getElementById(id + "_commander").remove();
  },
  closeTerminal: function() {
    for (i = 0; i < editor_screens.length; i++) {
      if (editor_screens[i].id == current_screen.id) {
        const closed_terminal_event = new CustomEvent("closed_terminal", {
          detail: {
            terminal: editor_screens[i].terminal
          }
        });
        document.dispatchEvent(closed_terminal_event);
        if (editor_screens[i].terminal != undefined) {
          editor_screens[i].terminal.xterm.destroy();
          commanders.close(current_screen.terminal.id);
        }
        editor_screens[i].terminal = undefined;
        current_screen.terminal = undefined;
        graviton.resizeTerminals();
      }
    }
  }
};
const screens = {
  add: function() {
    const current_id = `screen_${editor_screens.length + Math.random()}`;
    const new_screen_editor = document.createElement("div");
    new_screen_editor.classList = "g_editors";
    new_screen_editor.id = current_id;
    new_screen_editor.innerHTML = `
      <div class="g_tabs_bar flex smallScrollBar"></div>  
      <div class="g_editors_editors" >
        <p dragable=false class="translate_word temp_dir_message" idT="WelcomeMessage" >${
          current_config.language["WelcomeMessage"]
        }</p>
      </div>
      <div class="g_status_bar" >
        <p></p>
      </div>`;
    document
      .getElementById("g_content")
      .insertBefore(
        new_screen_editor,
        document.getElementById("g_content").children[
          document.getElementById("g_content").children.length - 1
        ]
      );
    current_screen = { id: current_id, terminal: undefined };
    const screen = {
      id: current_screen.id,
      terminal: undefined
    };
    editor_screens.push(screen);
    new_screen_editor.addEventListener(
      "click",
      function(event) {
        for (i = 0; i < editor_screens.length; i++) {
          if (editor_screens[i].id == this.id) {
            current_screen.id = this.id;
            current_screen.terminal = editor_screens[i].terminal;
          }
        }
      },
      false
    );
    const split_screen_event = new CustomEvent("split_screen", {
      detail: {
        screen: current_screen
      }
    });
    document.dispatchEvent(split_screen_event);
    graviton.resizeTerminals();
  },
  remove: function(id) {
    if (editor_screens.length != 1) {
      for (i = 0; i < editor_screens.length; i++) {
        if (editor_screens[i].id == id) {
          let tabs2 = [];
          for (b = 0; b < tabs.length; b++) {
            if (tabs[b].getAttribute("screen") == id) {
              tabs2.push(tabs[b]);
            }
          }
          if (tabs2.length == 0) {
            if (editor_screens[i].terminal != undefined) {
              editor_screens[i].terminal.xterm.destroy();
              commanders.close(editor_screens[i].terminal.id);
              editor_screens[i].terminal = undefined;
            }
            const closed_screen_event = new CustomEvent("closed_screen", {
              detail: {
                screen: editor_screens[i]
              }
            });
            document.dispatchEvent(closed_screen_event);
            document.getElementById(id).remove();
            editor_screens.splice(i, 1);
            editors.splice(i, 1);
            current_screen = {
              id: editor_screens[editor_screens.length - 1].id,
              terminal: editor_screens[editor_screens.length - 1].terminal
            };
            return true;
          } else {
            graviton.throwError(
              current_config.language["Notification.CloseAllTabsBefore"]
            );
            return false;
          }
          return;
        }
      }
      graviton.resizeTerminals();
    } else {
      graviton.throwError(
        current_config.language["Notification.CannotRemoveMoreScreens"]
      );
      return false;
    }
  },
  default: function() {
    for (i = 0; i < editor_screens.length; i++) {
      if (i != 0) {
        let tabs2 = [];
        const number = i;
        for (b = 0; b < tabs.length; b++) {
          if (tabs[b].getAttribute("screen") == editor_screens[number].id) {
            tabs2.push(tabs[b]);
          }
        }
        if (tabs2.length == 0) {
          if (editor_screens[number].terminal != undefined) {
            editor_screens[number].terminal.xterm.destroy();
            commanders.close(editor_screens[number].terminal.id);
            editor_screens[i].terminal = undefined;
          }
          document.getElementById(editor_screens[number].id).remove();
          editor_screens.splice(number, 1);
          editors.splice(number, 1);
          current_screen = {
            id: editor_screens[editor_screens.length - 1].id,
            terminal: editor_screens[editor_screens.length - 1].terminal
          };
          i--;
        } else {
          graviton.throwError(
            current_config.language["Notification.CloseAllTabsBefore"]
          );
        }
      }
    }
  }
};
window.onresize = function() {
  graviton.resizeTerminals();
};
