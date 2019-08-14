/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"

const _os = require("os");
const pty = require("node-pty");
const path = require("path");
const {
  Dialog,
  closeDialog
} = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "dialogs.js"
)), {
  Window,
  closeWindow
} = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "windows.js"
)), {
  Notification,
  closeNotification
} = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "notifications.js"
)), {
  Tab,
  closeTab,
  loadTab
} = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "tabs.js"
));

const dropMenu = require(path.join(
  __dirname,
  "src",
  "javascript",
  "controls",
  "dropmenus.js"
)).Dropmenu;
let {
  icons
} = require(path.join(
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
  Close: function () {
    closeTab(
      document.getElementById(this.getAttribute("target")).getAttribute("TabID")
    );
  }
};
const context_menu_list_file = {
  Remove: function () {
    directories.removeFileDialog(
      document.getElementById(
        document
        .getElementById(this.getAttribute("target"))
        .getAttribute("parent")
      )
    );
  },
  "a1": "*line",
  CopyPath: function () {
    copyText(document.getElementById(this.getAttribute("target")).getAttribute("dir").replace(/\\\\/g, "\\"))
  },

};
const context_menu_directory_options = {
  Reload: function () {
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
  OpenInExplorer: function () {
    shell.openItem(document.getElementById(document.getElementById(this.getAttribute("target")).getAttribute("parent")).getAttribute('dir'))
  },
  OpenAsGlobal: function () {
    loadDirs(
      document.getElementById(this.getAttribute("target")).getAttribute("dir").replace(/\\\\/g, "\\"),
      "g_directories",
      true
    );
  },
  "a1": "*line",
  NewFolder: function () {
    directories.newFolder(document.getElementById(this.getAttribute("target")).getAttribute("parent"));
  },
  NewFile: function () {
    directories.newFile(document.getElementById(this.getAttribute("target")).getAttribute("parent"));
  },
  "a2": "*line",
  CopyPath: function () {
    copyText(document.getElementById(this.getAttribute("target")).getAttribute("dir").replace(/\\\\/g, "\\"))
  },
  "a3": "*line",
  Remove: function () {
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
    if (this.name == undefined) {
      console.warn(` Plugin by name > ${object.name} < doesn't exist `);
      return;
    }
  }
  saveData(data, callback) {
    plugins_dbs[this.b].db = data;
    fs.writeFileSync(
      path.join(plugins_db, this.name) + ".json",
      JSON.stringify(data),
      function (err) {}
    );
    if (!callback == undefined) return callback;
  }
  setData(key, data) {
    const name = this.name;
    if (fs.existsSync(path.join(plugins_db, name) + ".json")) {
      this.getData(function (object) {
        object[key] = data;
        fs.writeFileSync(
          path.join(plugins_db, name) + ".json",
          JSON.stringify(object),
          function (err) {
            plugins_dbs[this.b].db = object;
          }
        );
      })

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
        function (err) {}
      );
      return "created";
    } else {
      return "already_exists";
    }
  }
  getData(callback) {
    const me = this;
    if (plugins_dbs[this.b] == undefined) {
      const name = this.name
      fs.readFile(path.join(plugins_db, name + ".json"), "utf8", function (
        err,
        data
      ) {
        const object = {
          plugin_name: path.basename(name, ".json"),
          db: JSON.parse(data)
        }
        plugins_dbs.push(object);
        for (i = 0; i < plugins_dbs.length; i++) {
          if (plugins_dbs[i].plugin_name == name) {
            //List package information
            me.b = i;
          }
        }
        return typeof callback == "function" ? callback(plugins_dbs[me.b].db) : plugins_dbs[me.b].db
      });
    } else {
      return typeof callback == "function" ? callback(plugins_dbs[me.b].db) : plugins_dbs[this.b].db
    }
  }
  deleteData(data) {
    switch (data) {
      case undefined:
        plugins_dbs[b].db = {};
        fs.writeFileSync(
          path.join(plugins_db, this.name) + ".json",
          "{}",
          function (err) {}
        );
        break;
      default:
        const object = this.getData();
        delete object[data];
        fs.writeFileSync(
          path.join(plugins_db, this.name) + ".json",
          JSON.stringify(object),
          function (err) {}
        );
        plugins_dbs[b].db = object;
    }
  }
}



function sleeping(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const graviton = {
  getCurrentTheme: function () {
    //Get the theme name of the applied theme
    return current_config.theme;
  },
  getSelectedText: function () {
    //Get te text you have selected
    const selected_text = window.getSelection().toString();
    if (selected_text !== "") {
      return selected_text;
    } else return null; //Returns null if there is not text selected
  },
  setThemeByName: function (name) {
    //Set a theme by it's name
    return setThemeByName(name);
  },
  getCurrentFile: function () {
    const _file = {
      path: filepath
    };
    return _file;
  },
  getCurrentEditor: function () {
    for (i = 0; i < editors.length; i++) {
      //Returns the current selected editor
      if (editorID == editors[i].id) {
        return editors[i];
      }
    }
    if (editors.length == 0) return null;
  },
  getCurrentDirectory: function () {
    if (dir_path == undefined) return null;
    return dir_path;
  },
  currentOS: function () {
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
  openDevTools: function () {
    require("electron")
      .remote.getCurrentWindow()
      .toggleDevTools();
  },
  editorMode: function () {
    return editor_mode;
  },
  throwError: function (message) {
    console.log('%c Graviton ERROR :: ', ' color: red', message);
    new Notification({
      title: "Error ",
      content: message
    });
  },
  dialogAbout: function () {
    new Dialog({
      id: "about",
      title: getTranslation("About") + " Graviton",
      content: `
	      ${getTranslation("Version")}: ${g_version.version} (${
        g_version.date
      }) - ${g_version.state}
	      <br> ${getTranslation("OS")}: ${graviton.currentOS().name}`,
      buttons: {
        [getTranslation("More")]: {
          click: () => {
            Settings.open();
            Settings.navigate('5')
          },
          important: true
        },
        [getTranslation("Close")]: {}
      }
    });
  },
  dialogChangelog: function () {
    fs.readFile(path.join(__dirname, "RELEASE_CHANGELOG.md"), "utf8", function (
      err,
      data
    ) {
      new Dialog({
        id: "changelog",
        title: `${getTranslation("Changelog")} - v${g_version.version}`,
        content: `<div style="padding:2px;">${marked(data)}</div>`,
        buttons: {
          [getTranslation("Close")]: {}
        }
      });
    });
  },
  removeScreen: function () {
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
      title: getTranslation("Dialog.RemoveScreen.title"),
      content: `<div style="overflow: auto;min-width: 100%;height: auto;overflow: auto;white-space: nowrap; display:flex;" >${content_editors}</div>`,
      buttons: {
        [getTranslation("Accept")]: {}
      }
    });
  },
  closingFileWarn: function () {
    new Dialog({
      id: "saving_file_warn",
      title: getTranslation("Warn"),
      content: getTranslation("FileExit-dialog-message"),
      buttons: {
        [getTranslation(
          "FileExit-dialog-button-accept"
        )]: {
          click: () => {
            closeTab(ele.getAttribute("tabid"), true);
          }
        },
        [getTranslation("Cancel")]: {},
        [getTranslation("FileExit-dialog-button-deny")]: {
          click: () => {
            saveFile()
          },
          important: true
        }
      }
    });
  },
  addContextMenu: function (panel) {
    Object.keys(panel).forEach(function (key) {
      context_menu_list_text[key] = panel[key];
    });
  },
  toggleFullScreen: function (status) {
    g_window.setFullScreen(status);
  },
  toggleZenMode: function () {
    if (editor_mode == "zen") {
      editor_mode = "normal";
      document.getElementById("explorer_app").style =
        "visibility: visible; width:210px; display:block;";
      document.getElementById("editor_resizer").style = " display:block;";
    } else {
      editor_mode = "zen";
      document.getElementById("explorer_app").style =
        "visibility: hidden; width:0px; display:none;";
      document.getElementById("editor_resizer").style = " width:0; display:none;";
    }
  },
  deleteLog: function () {
    fs.writeFile(logDir, "[]", err => {});
  },
  toggleAutoCompletation: function () {
    current_config["autoCompletionPreferences"] =
      current_config["autoCompletionPreferences"] == "activated" ?
      "desactivated" :
      "activated";
  },
  toggleLineWrapping: function () {
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
    }
  },
  toggleHighlighting: function () {
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
  useSystemAccent: function () {
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
        new Notification({
          title: "Issue",
          content: "Your system is not compatible with this feature."
        });
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
      document.getElementById("dropmenus_app").style =
        "visibility:hidden; width:0;";
      menus_showing = false;
    } else {
      document.getElementById("dropmenus_app").style = "";
      menus_showing = true;
    }
  },
  getPlugin: function (plugin_name) {
    for (i = 0; i < full_plugins.length; i++) {
      if (full_plugins[i].package.name == plugin_name) {
        return {
          repo: full_plugins[i],
          local: (function () {
            for (let a = 0; a < plugins_list.length; a++) {
              if (plugins_list[a].name == plugin_name) {
                return plugins_list[a];
              }
            }
            return undefined;
          })(),
          database: (function () {
            for (let a = 0; a < plugins_dbs.length; a++) {
              if (plugins_dbs[a].plugin_name == plugin_name) {
                return plugins_dbs[a].db;
              }
            }
            return undefined;
          })()
        };
      }
    }
    for (let a = 0; a < plugins_list.length; a++) {
      if (plugins_list[a].name == plugin_name) {
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
  toggleBounceEffect() {
    if (current_config.bouncePreferences == "activated") {
      current_config.bouncePreferences = "desactivated"
    } else {
      current_config.bouncePreferences = "activated"
    }
  },
  changeLanguageStatusBar(lang, screen) {
    const lang_ele = document.getElementById(screen).children[2].children[0];
    if (lang_ele.innerText == "") {
      lang_ele.style = "";
    }
    if (lang == "") {
      lang_ele.style = "padding:0px;";
    }
    lang_ele.setAttribute("title", `Current: ${lang} ${plang=="Unknown"?'(Unkown)':''}`)
    lang_ele.innerText = lang;
  },
  refreshStatusBarLinesAndChars(screen) {
    if (editor == undefined) {
      document.getElementById(screen).children[2].children[1].innerText = ""
      document.getElementById(screen).children[2].children[1].removeAttribute("title");
    } else {
      document.getElementById(screen).children[2].children[1].innerText = editor.getCursor().line+1 + "/" + editor.getCursor().ch+1
      document.getElementById(screen).children[2].children[1].title = `Line: ${editor.getCursor().line+1} , Char: ${editor.getCursor().ch+1}`
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
document.addEventListener("mousedown", function (event) {
  if (editor_booted === true) {
    if (event.button === 2) {
      graviton.closeDropmenus(); //Close opened dropmenu
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
        case "file":
          Object.keys(context_menu_list_file).forEach(function (
            key,
            index
          ) {
            if (context_menu_list_file[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);
              context_menu.appendChild(button);
              sleeping(1).then(() => {
                button.onclick = context_menu_list_file[key];
              });
            } else {
              const span = document.createElement("span");
              span.classList = 'line_space_menus';
              context_menu.appendChild(span)
            }
          });
          break;
        case "tab":
          Object.keys(context_menu_list_tabs).forEach(function (key, index) {
            if (context_menu_list_tabs[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);
              context_menu.appendChild(button);
              sleeping(1).then(() => {
                button.onclick = context_menu_list_tabs[key];
              });
            } else {
              const span = document.createElement("span");
              span.classList = 'line_space_menus';
              context_menu.appendChild(span)
            }
          });
          break;
        case "directory":
          Object.keys(context_menu_directory_options).forEach(function (
            key,
            index
          ) {
            if (context_menu_directory_options[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);

              sleeping(1).then(() => {
                button.addEventListener("click", context_menu_directory_options[key])
              });
              context_menu.appendChild(button);
            } else {
              const span = document.createElement("span");
              span.classList = 'line_space_menus';
              context_menu.appendChild(span)
            }
          });
          break;
        default:
          Object.keys(context_menu_list_text).forEach(function (key, index) {
            if (context_menu_list_text[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              if (index < 2) {
                button.innerText = getTranslation(key);
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
            } else {
              const span = document.createElement("span");
              span.classList = 'line_space_menus';
              context_menu.appendChild(span)
            }
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
          i = 0; i < document.getElementsByClassName("floating_window").length; i++
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
  terminal: function (object) {
    if (graviton.getCurrentDirectory() == null && object == undefined) {
      graviton.throwError(
        getTranslation("CannotRunTerminalCauseDirectory")
      );
      return;
    }
    if (current_screen.terminal != undefined) {
      if (document.getElementById(current_screen.terminal.id + '_commander').style.display == "none") {
        commanders.show(current_screen.terminal.id);
      }
      return;
    }
    const randomID = Math.random();
    new commander({
        id: "xterm" + randomID,
        content: ""
      },
      function (err) {
        if (!err) {
          const shell =
            process.env[_os.platform() === "win32" ? "COMSPEC" : "SHELL"];
          const ptyProcess = pty.spawn(shell, [], {
            cwd: object == undefined ?
              graviton.getCurrentDirectory() :
              object.path,
            env: process.env
          });
          const xterm = new Terminal({
            rows: "10",
            theme: {
              background: themeObject.colors[
                "editor-background-color"
              ],
              foreground: themeObject.colors["white-black"]
            }
          });
          xterm.open(
            document.getElementById("xterm" + randomID + "_commander")
          );
          xterm.on("data", data => {
            ptyProcess.write(data);
          });
          ptyProcess.on("data", function (data) {
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
  hide: function (id) {
    document.getElementById(id + "_commander").style.display = "none";
  },
  show: function (id) {
    console.log(id)
    document.getElementById(id + "_commander").style = "";
  },
  close: function (id) {
    document.getElementById(id + "_commander").remove();
  },
  closeTerminal: function () {
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
  add: function () {
    const current_id = `screen_${editor_screens.length + Math.random()}`;
    const new_screen_editor = document.createElement("div");
    new_screen_editor.classList = "g_editors";
    new_screen_editor.id = current_id;
    new_screen_editor.innerHTML = `
      <div class="g_tabs_bar flex smallScrollBar"></div>  
      <div class="g_editors_editors" >
     <div class=temp_dir_message> 
        <p dragable=false class="translate_word " idT="WelcomeMessage" >${
         getTranslation("WelcomeMessage")
        }</p>
        <img draggable="false" class="emoji-normal" src="src/openemoji/1F60E.svg"> 
      </div>
      </div>
      <div class="g_status_bar" >
        <span></span>
        <span></span>
      </div>`;
    document
      .getElementById("content_app")
      .insertBefore(
        new_screen_editor,
        document.getElementById("content_app").children[
          document.getElementById("content_app").children.length - 1
        ]
      );
    current_screen = {
      id: current_id,
      terminal: undefined
    };
    const screen = {
      id: current_screen.id,
      terminal: undefined
    };
    editor_screens.push(screen);
    new_screen_editor.addEventListener(
      "click",
      function (event) {
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
  remove: function (id) {
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
              getTranslation("Notification.CloseAllTabsBefore")
            );
            return false;
          }
          return;
        }
      }
      graviton.resizeTerminals();
    } else {
      graviton.throwError(
        getTranslation("Notification.CannotRemoveMoreScreens")
      );
      return false;
    }
  },
  default: function () {
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
            getTranslation("Notification.CloseAllTabsBefore")
          );
        }
      }
    }
  }
};
window.onresize = function () {
  graviton.resizeTerminals();
};

function copyText(content) {
  const text = document.createElement("textarea");
  text.style = "height:0.1px; width:0.1px; opacitiy:0; padding:0; border:0; margin:0; outline:0;";
  text.innerText = content;
  document.body.appendChild(text);
  text.focus();
  text.select();
  document.execCommand('copy');
  text.remove();
}