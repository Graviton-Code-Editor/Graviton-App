/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

const GravitonInfo = {
  date: "200104",
  version: "1.3.0",
  state: "Beta"
}

const fs = require("fs-extra"),
  remote = require("electron").remote,
  BrowserWindow = require("electron").BrowserWindow,
  getAppDataPath = require("appdata-path"),
  { webFrame } = require("electron"),
  GravitonWindow = remote.getCurrentWindow(),
  { systemPreferences } = remote,
  CodeMirror = require("codemirror"),
  semver = require("semver"),
  tinycolor = require("tinycolor2"),
  EventEmitter = require("events"),
  sanitize = require("light-sanitize-html"),
  { puffin } = require("@mkenzo_8/puffin"),
  shell = remote.shell

require('v8-compile-cache');
require('./src/javascript/npm/npm_panel')
require('./src/javascript/api/codemirror-langs') 
require('./src/javascript/api/utils/codemirrorClient') 

const {CommandLauncher} = require('./src/javascript/components/global/commander'),
  { loadLanguage, getTranslation } = require('./src/javascript/api/languages'),
  { elasticContainerComponent, elasticContainer } = require('./src/javascript/api/web_components/elastic_container.js'),
  { getFormat, getLanguageName, updateCodeMode } = require('./src/javascript/api/format'),
  screens = require('./src/javascript/api/screens'),
  updater = require('./src/javascript/api/updater'),
  {Settings} = require('./src/javascript/windows/settings'),
  {Welcome} = require('./src/javascript/windows/welcome'),
  {Setup} = require('./src/javascript/windows/setup'),
  {Market} = require('./src/javascript/windows/market'),
  {Plugins} = require('./src/javascript/api/plugins'),
  {Menus} = require('./src/javascript/api/menus'),
  {Explorer} = require('./src/javascript/api/explorer'),
  {Control} = require('./src/javascript/api/constructors/control'),
  { Dialog, closeDialog } = require('./src/javascript/api/constructors/dialogs'),
  { Window, closeWindow } = require('./src/javascript/api/constructors/windows'),
  { Notification, closeNotification } = require('./src/javascript/api/constructors/notifications'),
  { Tab, closeTab, loadTab } = require('./src/javascript/api/tabs'),
  { dropMenu } = require('./src/javascript/api/constructors/dropmenus'),
  { icons } = require('./src/javascript/api/constructors/icons'),
  { commander, commanders } = require('./src/javascript/api/constructors/commanders'),
  { Panel } = require('./src/javascript/api/constructors/panels')

window.customElements.define("elastic-container", elasticContainerComponent)

window.customElements.define(
  "gv-switch",
  require('./src/javascript/api/web_components/switch')
)
window.customElements.define(
  "gv-navpanel",
  require('./src/javascript/api/web_components/navpanel')
)

window.customElements.define(
  "gv-process",
  require('./src/javascript/api/web_components/process_bar')
)
graviton.loadKeyShortcuts = require('./src/javascript/api/shortcuts');

let current_screen,
  dir_path,
  i,
  b,
  DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton"),
  tabs = [],
  FirstFolder = null,
  editingTab,
  plang = "",
  filepath = null,
  editors = [],
  editor,
  editorID,
  editor_mode = "normal",
  g_highlighting = "activated",
  log = [],
  themes = [],
  pagesEvents = [],
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
      ).getPropertyValue("--accentDarkColor"),
      "editor-background-color": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--editor-background-color")
    }
  },
  new_update = false,
  mouseClicked = false,
  touchingResizerValue = false,
  editor_screens = [],
  languages = [],
  dictionary = autocomplete,
  terminal = null,
  workspaces = [],
  plugins_market = [],
  current_plugins = 0,
  templates = {},
  plugins_list = [],
  plugins_dbs = [],
  anyDropON = null,
  marketCache = {
    date :null,
    plugins :[],
    fancyDate:null
  },
  projectServices = [],
  EXPLORER_PANEL = null,
  projectTemplates = require('./src/javascript/api/utils/templates'),
  sourceDir = __dirname,
  GravitonCommander = null

const default_plugins = [
  "Graviton-Code-Editor/Dark",
  "Graviton-Code-Editor/Arctic"
] //Plugins which are installed in the setup process

if (graviton.isProduction()) {
  DataFolderDir = path.join(getAppDataPath(), ".graviton")
}

if (!fs.existsSync(DataFolderDir)) {
  fs.mkdirSync(DataFolderDir) // Create .graviton if it doesn't exist
}

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json"),
  configDir = path.join(DataFolderDir, "config.json"),
  plugins_folder = path.join(DataFolderDir, "plugins"),
  plugins_db = path.join(DataFolderDir, "plugins_db"),
  market_file = path.join(DataFolderDir, "market.json");

(function(){
  const preload = array => {
    // Preload images when booting
    for (i = 0; i < array.length; i++) {
      document.body.innerHTML += `
       <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`;
      document.getElementById(array[i]).remove();
    }
  };
  
  const preloadFont = array => {
    // Preload fonts when booting
    for (i = 0; i < array.length; i++) {
      const ele = document.createElement("p");
      ele.textContent = ".";
      ele.id = array[i];
      ele.style.fontFamily = array[i];
      document.body.appendChild(ele);
      setTimeout(function() {
        ele.remove();
      }, 1);
    }
  };

  preload([
    "src/icons/folder_opened.svg",
    "src/icons/custom_icons/git.svg",
    "src/icons/custom_icons/node_modules.svg"
  ])
  
  preloadFont(["editor", "terminal"])

})()


window.onload = async function() {
  await fs.readdir(path.join(__dirname, "languages")).then(function(paths) {
    paths.forEach((dir, index) => {
      languages.push(require(path.join(__dirname, "languages", dir)))
      if (document.getElementById("boot_loader") !== null) {
        document.getElementById("boot_loader").children[0].style.width +=
          index + 35 + "%"
      }
      if (index === paths.length - 1) {
        loadGraviton()
      }
    })
  })
  function loadGraviton() {
    graviton.loadConfiguration()
    graviton.consoleInfo("Configuration has been synched.")
    if (document.getElementById("boot_loader") !== null) {
      document.getElementById("boot_loader").children[0].style =
        "width: 100%; border-radius:100px;"
    }
  }
}

const create = {
  folder(id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute("dir"), value)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
      Explorer.load(
        element.getAttribute("dir"),
        element.id,
        element.getAttribute("global")
      )
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError2")
      })
    }
  },
  file(id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute("dir"), value)
    if (!fs.existsSync(dir)) {
      fs.writeFile(dir, "", function() {
        Explorer.load(
          element.getAttribute("dir"),
          element.id,
          element.getAttribute("global")
        )
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
  newFolder(object) {
    new Dialog({
      id: "new_folder",
      title: getTranslation("Dialog.RenameTo"),
      content: `<input  id='rename_dialog' class='section-1 input2' placeholder="New Folder" >  </input>`,
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation("Accept")]: {
          click: () => {
            create.folder(
              object,
              document.getElementById("rename_dialog").value === ""
                ? "New folder"
                : document.getElementById("rename_dialog").value
            )
          },
          important: true
        }
      }
    })
    document
      .getElementById("rename_dialog")
      .addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault()
          create.folder(object, this.value === "" ? "New folder" : this.value)
          closeDialog("new_folder")
        }
      })
    document.getElementById("rename_dialog").focus()
  },
  newFile(object) {
    new Dialog({
      id: "new_file",
      title: getTranslation("Dialog.RenameTo"),
      content: `<input  id='rename_dialog' class='section-1 input2' placeholder="NewFile.txt" >  </input>`,
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation("Accept")]: {
          click: () => {
            create.file(
              object,
              document.getElementById("rename_dialog").value === ""
                ? "NewFile.txt"
                : document.getElementById("rename_dialog").value
            )
          },
          important: true
        }
      }
    })
    document
      .getElementById("rename_dialog")
      .addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault()
          create.file(object, this.value === "" ? "NewFile.txt" : this.value)
          closeDialog("new_file")
        }
      })
    document.getElementById("rename_dialog").focus()
  },
  removeFileDialog(object) {
    new Dialog({
      id: "remove_file",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation("Accept")]: {
          click: () => {
            directories.removeFile(object.id)
          }
        }
      }
    })
  },
  removeFolderDialog(object) {
    new Dialog({
      id: "remove_folder",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation("Accept")]: {
          click: () => {
            directories.removeFolder(object.id)
          }
        }
      }
    })
  },
  removeFile(id) {
    const trash = require('trash');
    const object = document.getElementById(id)
    trash([object.getAttribute("dir")]).then(a=>object.parentElement.remove())
  },
  removeFolder(id) {
    const trash = require('trash');
    const object = document.getElementById(id)
    trash([object.getAttribute("dir")]).then(a=>object.parentElement.remove())
  },
  getCustomIcon(dir, state) {
    if (
      themeObject.icons == undefined ||
      dir == "node_modules" ||
      dir == ".git" ||
      (themeObject.icons["folder_closed"] == undefined && state == "close") ||
      (themeObject.icons["folder_opened"] == undefined && state == "open")
    ) {
      switch (dir) {
        case "node_modules":
          return "src/icons/custom_icons/node_modules.svg"
          break
        case ".git":
          return "src/icons/custom_icons/git.svg"
          break
        default:
          if (state == "close") {
            return "src/icons/folder_closed.svg"
          } else {
            return "src/icons/folder_opened.svg"
          }
      }
    } else {
      switch (dir) {
        case "node_modules":
          return path.join(themeObject.name, themeObject.icons["node_modules"])
          break
        case ".git":
          return path.join(themeObject.name, themeObject.icons["git"])
          break
        default:
          if (state == "close") {
            return path.join(
              themeObject.name,
              themeObject.icons["folder_closed"]
            )
          } else {
            return path.join(
              themeObject.name,
              themeObject.icons["folder_opened"]
            )
          }
      }
    }
  }
}


const selectionFromTo = (parent, toSelect) => {
  const children = parent.children
  for (let child of children) {
    child.classList.remove("active")
  }
  if (toSelect != undefined) toSelect.classList.add("active")
}

GravitonWindow.on("blur", function() {
  if (graviton.currentOS().codename === "darwin") {
    document.getElementById("controls_macOS").classList.toggle("blur")
  }
})
GravitonWindow.on("focus", function() {
  if (graviton.currentOS().codename === "darwin") {
    document.getElementById("controls_macOS").classList.remove("blur")
  }
})

window.addEventListener("resize",function(){
  graviton.refreshEditors()
})



