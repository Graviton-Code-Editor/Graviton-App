/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

const GravitonInfo = {
   date: "190802",
   version: "1.1.0",
   state: "Beta"
};
const os = require("os"),
   {
      shell
   } = require("electron"),
   fs = require("fs-extra"),
   {
      dialog
   } = require("electron").remote,
   remote = require("electron").remote,
   BrowserWindow = require("electron").BrowserWindow,
   app = require("electron").remote,
   getAppDataPath = require("appdata-path"),
   {
      webFrame
   } = require("electron"),
   g_window = require("electron").remote.getCurrentWindow(),
   {
      systemPreferences
   } = require("electron").remote,
   url = require("url"),
   marked = require("marked"),
   fit = require("./node_modules/xterm/lib/addons/fit/fit.js"),
   CodeMirror = require("codemirror"),
   semver = require("semver");

require(path.join(__dirname, 'src', 'javascript', 'api', 'codemirror-langs.js')).langs() //Load CodeMirror files
const { elasticContainerComponent, elasticContainer } = require(path.join(__dirname, 'src', 'javascript', 'api', 'elastic_container.js'))
graviton.loadEditor = require(path.join(__dirname, 'src', 'javascript', 'api', 'editors.js')).loadEditor
window.customElements.define("elastic-container", elasticContainerComponent);

const {
   loadLanguage,
   getTranslation
} = require(path.join(__dirname, 'src', 'javascript', 'api', 'languages.js'));
const {
   getFormat,
   getLanguageName,
   updateCodeMode
} = require(path.join(__dirname, 'src', 'javascript', 'api', 'format.js'));
const screens = require(path.join(__dirname, 'src', 'javascript', 'api', 'screens.js'));
const updater = require(path.join(__dirname, 'src', 'javascript', 'api', 'updater.js'));
graviton.setTheme = require(path.join(__dirname, "src", "javascript", "api", "theming.js")).setTheme;


const Settings = require(path.join(__dirname, 'src', 'javascript', 'windows', 'settings.js')).Settings;
const Welcome = require(path.join(__dirname, 'src', 'javascript', 'windows', 'welcome.js')).Welcome;
const Setup = require(path.join(__dirname, 'src', 'javascript', 'windows', 'setup.js')).Setup;
const Market = require(path.join(__dirname, 'src', 'javascript', 'windows', 'market.js')).Market;

const Plugins = require(path.join(__dirname, 'src', 'javascript', 'api', 'plugins.js')).Plugins;
const Menus = require(path.join(__dirname, 'src', 'javascript', 'api', 'menus.js')).Menus;

window.customElements.define('gv-switch',require(path.join(__dirname, 'src', 'javascript', 'api', 'switch.js')).Switch)

let current_screen,
   dir_path,
   i,
   b,
   DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton"),
   tabs = [],
   FirstFolder = null,
   editingTab,
   plang = "",
   _notifications = [],
   filepath = null,
   editors = [],
   editor,
   editorID,
   editor_mode = "normal",
   g_highlighting = "activated",
   log = [],
   themes = [],
   themeObject = {
      colors: {
         accentColor: getComputedStyle(document.documentElement).getPropertyValue(
            "--accentColor"
         ),
         accentLightColor: getComputedStyle(
            document.documentElement
         ).getPropertyValue("--accentLightColor"),
         accentDarkColor: getComputedStyle(
            document.documentElement
         ).getPropertyValue("--accentDarkColor")
      }
   },
   new_update = false,
   mouseClicked = false,
   touchingResizerValue = false,
   editor_screens = [],
   languages = [],
   dictionary = autocomplete,
   Mousetrap = require('mousetrap'),
   terminal = null,
   workspaces = [],
   plugins_market = [],
   current_plugins = 0;

let templates = {};

let plugins_list = [],
    plugins_dbs = [];

let anyDropON = null;

let full_plugins = [];

const default_plugins = [
  "Graviton-Code-Editor/Dark",
  "Graviton-Code-Editor/Arctic"
]; //Plugins which are installed in the setup process

if (graviton.isProduction()) {
   DataFolderDir = path.join(getAppDataPath(), ".graviton");
}

if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir); // Create .graviton if it doesn't exist

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json"),
   configDir = path.join(DataFolderDir, "config.json"),
   plugins_folder = path.join(DataFolderDir, "plugins"),
   plugins_db = path.join(DataFolderDir, "plugins_db"),
   market_file = path.join(DataFolderDir, "market.json");

document.addEventListener(
   "mousedown",
   function(event) {
      if (event.which) mouseClicked = true;
   },
   true
);

document.addEventListener(
   "mouseup",
   function(event) {
      if (event.which) mouseClicked = false;
   },
   true
);
document.addEventListener(
   "mousemove",
   function(event) {
      if (mouseClicked && touchingResizerValue) {
         const explorer = document.getElementById("explorer_app");
         const content_app = document.getElementById("content_app");
         if (current_config.explorerPosition === 'left') {
            explorer.style = `width: ${event.clientX - 3}px`;
         } else {
            explorer.style = `width: ${   content_app.clientWidth - event.clientX }px`;
         }
         for (i = 0; i < editors.length; i++) {
            editors[i].object.blur()
         }
         graviton.resizeTerminals();
      }
   },
   true
);

preload([

   "src/icons/folder_opened.svg",
   "src/icons/custom_icons/git.svg",
   "src/icons/custom_icons/node_modules.svg"
]);

window.onload = function() {
   fs.readdir(path.join(__dirname, "src", "templates"), (err, paths) => {
      let temporal_count = 0;
      paths.forEach((dir, index) => {
         fs.readFile(path.join(__dirname, "src", "templates", dir), "utf8", function(
            err,
            data
         ) {
            templates[path.basename(dir, ".html")] = data;
            temporal_count++;
            if (temporal_count == paths.length) {
               fs.readdir(path.join(__dirname, "languages"), (err, paths) => {
                  let path_count = paths.length;
                  paths.forEach(dir => {
                     fs.readFile(path.join(__dirname, "languages", dir), "utf8", function(
                        err,
                        data
                     ) {
                        if (err) throw err;
                        let _err_parsing = false;
                        try {
                           JSON.parse(data);
                        } catch {
                           path_count--;
                           graviton.consoleWarn("Couldn't parse the language: " + dir)
                           _err_parsing = true;
                        }
                        if (!_err_parsing) {
                           languages.push(JSON.parse(data)); // Push the language
                        }
                        if (languages.length === path_count) {
                           graviton.loadControlButtons();
                           loadConfig();
                           graviton.consoleInfo("All templates have been loaded.")
                        }
                     });
                  });
               });
            }
         });
      });
   });
}

graviton.setTitle(`v${GravitonInfo.version}`); //Initial title

const appendBinds = () => {
   Mousetrap.bind("mod+s", function() {
      saveFile();
   });
   Mousetrap.bind("mod+n", function() {
      screens.add();
   });
   Mousetrap.bind("mod+l", function() {
      screens.remove(current_screen.id);
   });
   Mousetrap.bind("mod+e", function() {
      graviton.toggleZenMode();
   });
   Mousetrap.bind("mod+t", function() {
      if (terminal != null) {
         commanders.show(terminal.id);
         return;
      }
      commanders.terminal();
   });
   Mousetrap.bind("mod+u", function() {
      commanders.closeTerminal();
   });
   Mousetrap.bind("mod+h", function() {
      if (terminal != null) {
         commanders.hide(terminal.id);
      }
   });
   Mousetrap.bind("f11", function() {
      graviton.toggleFullScreen();
   });
   Mousetrap.bind("mod+tab", function() {
      graviton.toggleMenus();
   });
};

function saveFileAs() {
   dialog.showSaveDialog(fileName => {
      fs.writeFile(fileName, editor.getValue(), err => {
         if (err) {
            alert(`An error ocurred creating the file ${err.message}`);
            return;
         }
         filepath = fileName;
         new Notification({
            title: "Graviton",
            content: `The file has been succesfully saved in ${fileName}`
         });
      });
   });
}

function openFile() {
   dialog.showOpenDialog(fileNames => {
      // fileNames is an array that contains all the selected files
      if (fileNames === undefined) {
         return;
      }
      new Tab({
         id: Math.random() + fileNames[0].replace(/\\/g, "") + "B",
         path: fileNames[0],
         name: fileNames[0],
         type: "file"
      });
   });
}

function openFolder() {
   dialog.showOpenDialog({
      properties: ["openDirectory"]
   }, selectedFiles => {
      if (selectedFiles === undefined) return;
      loadDirs(selectedFiles[0], "g_directories", true);
   });
}

function saveFile() {
   if (graviton.getCurrentEditor().editor != undefined) {
      fs.writeFile(filepath, editor.getValue(), err => {
         if (err) return err;
         document.getElementById(editingTab).setAttribute("file_status", "saved");
         document
            .getElementById(editingTab)
            .children[1].setAttribute(
               "onclick",
               document
               .getElementById(editingTab)
               .children[1].getAttribute("onclose")
            );
         document.getElementById(editingTab).children[1].innerHTML =
            icons["close"];
         const file_saved_event = new CustomEvent("file_saved", {
            data: {
               object: graviton.getCurrentEditor().object
            }
         });
         document.dispatchEvent(file_saved_event);
      });
   }
}

function loadDirs(dir, app_id, f_t, callback) {
   const first_time =
      f_t == (true || "true") ? true : f_t == "reload" ? false : f_t;
   if (!fs.existsSync(dir)) {
      graviton.throwError(getTranslation("DirectoryDoesntExist"));
      return;
   }
   const appender_id = app_id.replace(/\\/g, "");
   if (appender_id == "g_directories") {
      document.getElementById(
         "explorer_app"
      ).innerHTML = `<div global=true dir="${dir}" id="g_directories"></div>`;
      dir_path = dir;
   }
   let working_folder;
   FirstFolder = dir;
   const appender = document.getElementById(appender_id);
   if (f_t == "reload") {
      appender.setAttribute("opened", "true");
      appender.children[0].children[0].setAttribute(
         "src",
         directories.getCustomIcon(path.basename(FirstFolder), "close")
      );
      appender.children[1].innerHTML = "";
      const click = document.getElementById(appender_id).children[0];
      click.children[0].setAttribute(
         "src",
         directories.getCustomIcon(path.basename(FirstFolder), "open")
      );
   } else {
      if (appender.getAttribute("opened") == "true") {
         appender.setAttribute("opened", "false");
         appender.children[0].children[0].setAttribute(
            "src",
            directories.getCustomIcon(path.basename(FirstFolder), "close")
         );
         appender.children[1].innerHTML = "";
         return;
      } else {
         document.getElementById(appender_id).setAttribute("opened", "true");
         if (first_time == false) {
            const click = document.getElementById(appender_id).children[0];
            click.children[0].setAttribute(
               "src",
               directories.getCustomIcon(path.basename(FirstFolder), "open")
            );
         }
      }
   }
   if (first_time) {
      workspaces[0] = FirstFolder;
      graviton.setTitle(FirstFolder);
      if (document.getElementById("openFolder") != null)
         document.getElementById("openFolder").remove();
      registerNewProject(dir);
      working_folder = document.createElement("div");
      for (i = 0; i < document.getElementById(appender_id).children.length; i++) {
         document.getElementById(appender_id).children[i].remove();
      }
      document.getElementById(appender_id).setAttribute("opened", "false");
      working_folder.setAttribute("id", "g_directory");
      working_folder.setAttribute("myPadding", "50");
      working_folder.innerHTML = `
      <div>
        <p global=true id=directory_${path.basename(
          dir
        )} parent=g_directories elementType=directory dir=${FirstFolder}>${path.basename(
      dir
    )}</p>
      </div>`;
      document.getElementById(appender_id).appendChild(working_folder);
   } else {
      working_folder = document.getElementById(appender_id).children[1];
   }
   const paddingListDir =
      Number(document.getElementById(appender_id).getAttribute("myPadding")) + 10; // Add padding
   fs.readdir(dir, (err, paths) => {
            if (paths == undefined || err) {
               graviton.throwError(
                  "Cannot read files on the directory :" +
                  FirstFolder +
                  ". Check the permissions."
               );
               return;
            }
            for (i = 0; i < paths.length; i++) {
               let _long_path = path.join(dir, paths[i]);
               if (graviton.currentOS().codename == "win32") {
                  _long_path = _long_path.replace(/\\/g, "\\\\");
               }
               const stats = fs.statSync(_long_path);
               if (stats.isDirectory()) {
                  const directory_temp = document.createElement("div");
                  const parent_id = _long_path.replace(/[\\\s]/g, "") + "_div";
                  directory_temp.innerHTML += `
        <div title=${path.join(dir, paths[i])} global=reload dir="${_long_path}"  opened="false" ID="${parent_id}" name="${
          paths[i]
        }" style="padding-left:${paddingListDir}px; vertical-align:middle;">
          <div parent=${parent_id}  ID="${parent_id +"_div"}" elementType=directory global=reload dir="${_long_path}"  class="directory" onclick="loadDirs('${_long_path}','${parent_id}',false)">
            <img draggable=false file=${paths[i]} class="explorer_file_icon" parent=${parent_id} ID="${parent_id+ "_img"}" elementType=directory global=reload dir="${_long_path}" style="float:left; padding-right:3px; height:22px; width:24px; " src="${directories.getCustomIcon(
              paths[i],
              "close"
            )}">
            <p parent=${parent_id} ID="${parent_id+ "_p"}" elementType=directory global=reload dir="${_long_path}">
            ${paths[i]}
            </p>
          </div>
          <div myPadding="${paddingListDir}" dir="${_long_path}"></div>
        </div>`;
                  working_folder.appendChild(directory_temp);
               }
            }
            for (i = 0; i < paths.length; i++) {
               let _long_path = path.join(dir, paths[i]);
               if (graviton.currentOS().codename == "win32") {
                  _long_path = _long_path.replace(/\\/g, "\\\\");
               }
               const stats = fs.statSync(_long_path);
               if (stats.isFile()) {
                  const file_temp = document.createElement("div");
                  const parent_id = _long_path.replace(/[\\\s]/g, "") + "_div";
                  file_temp.innerHTML += `
                     <div title=${path.join(dir, paths[i])} parent="${parent_id}" elementType="file" onclick="new Tab({
                        id:'${parent_id + "B"}',
                        path:'${_long_path}',
                        name:'${paths[i]}',
                        type:'file'
                     })" myPadding="${paddingListDir}" dir="${_long_path}" class="directory" ID="${parent_id}" name="${
                        paths[i]
                     }" style=" margin-left:${paddingListDir}px; vertical-align:middle;">
                        <img draggable=false file=${paths[i]} class="explorer_file_icon" parent="${parent_id}" ID="${parent_id +"_img"}" dir="${_long_path}" elementType="file" style="float:left; padding-right:3px; height:24px; width:24px;" src="${
                           (function(){
                           if(themeObject.icons == undefined  ||(themeObject.icons[getFormat(paths[i]).lang]==undefined  && getFormat(paths[i]).trust==true ) ){
                              return `src/icons/files/${getFormat(
                                 paths[i]
                              ).lang}.svg`
                           }else{
                              if(themeObject.icons[getFormat(paths[i]).lang] == undefined  && themeObject.icons[getFormat(paths[i]).format] == undefined){
                                 return `src/icons/files/${getFormat(paths[i]).lang}.svg `
                }
                if(getFormat(paths[i]).trust==true){
                  return path.join(plugins_folder,themeObject.name,themeObject.icons[getFormat(paths[i]).lang])
                }else{
                  return path.join(plugins_folder,themeObject.name,themeObject.icons[getFormat(paths[i]).format])
                }
              }
            })()
          }">
          <p parent="${parent_id}" ID="${parent_id+"_p"}" dir="${_long_path}" elementType="file">
          ${paths[i]}
          </p>
        </div>`;
        working_folder.appendChild(file_temp);
      }
    }
    callback != undefined ? callback() : "";
  });
}
const create = {
  folder: function (id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'), value)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      loadDirs(
        element.getAttribute('dir'),
        element.id,
        element.getAttribute("global"),
        function () {
          //Created the new folder
        });
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError2")
      })
    }
  },
  file: function (id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'), value)
    if (!fs.existsSync(dir)) {
      fs.writeFile(dir, "", function () {
        loadDirs(
          element.getAttribute('dir'),
          element.id,
          element.getAttribute("global"),
          function () {
            //callback
          });
      })
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError1")
      })
    }
  }
}

const directories = {
  newFolder: function (object) {
    new Dialog({
      id: "new_folder",
      title: getTranslation("Dialog.RenameTo"),
      content: "<div  id='rename_dialog' class='section-1' contentEditable> New Folder </div>",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            create.folder(object, document.getElementById('rename_dialog').innerText)
          },
          important: true
        }
      }
    });
    document.getElementById("rename_dialog").focus()
  },
  newFile: function (object) {
    new Dialog({
      id: "new_file",
      title: getTranslation("Dialog.RenameTo"),
      content: "<div id='rename_dialog' class='section-1' contentEditable> New File.txt </div>",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            create.file(object, document.getElementById('rename_dialog').innerText);
          },
          important: true
        }
      }
    });
    document.getElementById("rename_dialog").focus()
  },
  removeFileDialog: function (object) {
    new Dialog({
      id: "remove_file",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            directories.removeFile(object.id);
          }
        }
      }
    });
  },
  removeFolderDialog: function (object) {
    new Dialog({
      id: "remove_folder",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            directories.removeFolder(object.id);
          }
        }
      }
    });
  },
  removeFile: function (id) {
    const object = document.getElementById(id);
    fs.unlink(object.getAttribute("dir"), function (err) {
      if (err) graviton.throwError(err);
      object.remove();
    });
  },
  removeFolder: function (id) {
    const rimraf = require("rimraf");
    const object = document.getElementById(id);
    rimraf.sync(object.getAttribute("dir"))
    object.remove();
  },
  getCustomIcon: function (dir, state) {
    if (themeObject.icons == undefined || dir == "node_modules" || dir == ".git" || (themeObject.icons["folder_closed"] == undefined && state == "close") || (themeObject.icons["folder_opened"] == undefined && state == "open")) {
      switch (dir) {
        case "node_modules":
          return "src/icons/custom_icons/node_modules.svg";
          break;
        case ".git":
          return "src/icons/custom_icons/git.svg";
          break;
        default:
          if (state == "close") {
            return "src/icons/folder_closed.svg";
          } else {
            return "src/icons/folder_opened.svg";
          }
      }

    } else {
      switch (dir) {
        case "node_modules":
          return path.join(themeObject.name, themeObject.icons["node_modules"])
          break;
        case ".git":
          return path.join(themeObject.name, themeObject.icons["git"])
          break;
        default:
          if (state == "close") {
            return path.join(themeObject.name, themeObject.icons["folder_closed"])
          } else {
            return path.join(themeObject.name, themeObject.icons["folder_opened"])
          }
      }
    }

  }
};

/*
 * Used for loading it's icon in the explorer menu
 * Not recognized formats will have the unknown icon as default
 */


const registerNewProject = function (dir) {
  // Add a new directory to the history if it is the first time it has been opened in the editor
  for (i = 0; i < log.length + 1; i++) {
    if (i != log.length) {
      if (log[i].Path == dir) {
        return;
      }
    } else if (i == log.length) {
      log.unshift({
        Name: path.basename(dir),
        Path: dir
      });
      fs.writeFile(logDir, JSON.stringify(log));
      return;
    }
  }
};

const createNewProject = function (template) {
  dialog.showOpenDialog({
    properties: ["openDirectory"]
  }, selectedFiles => {
    if (selectedFiles !== undefined) {
      switch (template) {
        case "html":
          const g_project_dir = path.join(
            selectedFiles[0],
            ".GravitonProject " + Date.now()
          );
          fs.mkdirSync(g_project_dir);
          fs.writeFile(
            path.join(g_project_dir, "index.html"),
            graviton.getTemplate('html_project'),
            err => {
              if (err) {
                return err;
              }
              loadDirs(g_project_dir, "g_directories", true);
            }
          );
          break;
      }
    }
  });
};
const touchingResizer = type => {
  if (type == false) {
    if (!mouseClicked) {
      touchingResizerValue = false;
    }
  } else {
    touchingResizerValue = true;
  }
};

function checkVariables(text) {
  let _variables = [];
  for (i = 0; i < text.length; i++) {
    switch (editor.getMode().name) {
      case "javascript":
        switch (text[i]) {
          case "let":
          case "var":
          case "const":
            _variables.push({
              _name: text[i + 1]
            });
            break;
        }
        break;
      case "java":
        switch (text[i]) {
          case "int":
          case "char":
          case "float":
            _variables.push({
              _name: text[i + 1]
            });
            break;
        }
        break;
    }
  }
  return _variables;
}

const installCli = function () {
   const npm = require('npm')
   npm.load({
     global: true
   }, function (er) {
     if (er) return er;
     npm.commands.install(['graviton-cli'], function (er, data) {
       if (er) return er;
       console.log("Graviton CLI has been installed!")
     })
   })
 }

 window.onclick = function(event) {
   if (
     !(event.target.matches(".dropbtn") || event.target.matches(".icon_border"))
   ) {
     graviton.closeDropmenus();
   }
   if (!event.target.matches(".option")) {
     document.getElementById("context").parentElement.style = "display:none";
   }
   if (!event.target.matches("#context_menu")) {
     if (document.getElementById("context_menu") != undefined) {
       document.getElementById("context_menu").remove();
     }
   }
 };
 graviton.refreshCustomization =  () => {
   document.documentElement.style.setProperty(
     '--editor-font-size',
     `${current_config.fontSizeEditor}px`
   ) // Update settings from start
   webFrame.setZoomFactor(current_config.appZoom / 25)
   if (current_config.blurPreferences != 0) {
     document.documentElement.style.setProperty(
       '--blur',
       `${current_config.blurPreferences}px`
     )
   } else {
     document.documentElement.style.setProperty('--blur', `none`)
   }
 }
 
function selectLang (lang) {
   const languages_divs = document.getElementsByClassName('language_div')
   for (i = 0; i < languages_divs.length; i++) {
     languages_divs[i].classList.remove('active')
   }
   lang.classList.add('active')
 }
 
 function selectTheme (from, theme) {
   let themes_divs
   switch (from) {
     case '1':
       themes_divs = document.getElementsByClassName('theme_div')
       break
     case '2':
       themes_divs = document.getElementsByClassName('theme_div2')
       break
   }
   for (i = 0; i < themes_divs.length; i++) {
     themes_divs[i].classList.remove('active')
   }
   theme.classList.add('active')
 }