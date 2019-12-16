/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

const GravitonInfo = {
  date: "191216",
  version: "1.2.0",
  state: "Beta"
}

const fs = require("fs-extra"),
  remote = require("electron").remote,
  BrowserWindow = require("electron").BrowserWindow,
  getAppDataPath = require("appdata-path"),
  { webFrame } = require("electron"),
  g_window = remote.getCurrentWindow(),
  { systemPreferences } = remote,
  CodeMirror = require("codemirror"),
  semver = require("semver"),
  tinycolor = require("tinycolor2"),
  EventEmitter = require("events"),
  sanitize = require("light-sanitize-html"),
  { puffin } = require("@mkenzo_8/puffin"),
  shell = remote.shell

require('v8-compile-cache');

require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "codemirror-langs.js"
)).langs() //Load CodeMirror files

const { elasticContainerComponent, elasticContainer } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "web_components",
  "elastic_container.js"
))

window.customElements.define("elastic-container", elasticContainerComponent)

graviton.loadEditor = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "editors.js"
)).loadEditor

graviton.events = require(path.join(
  __dirname,
  "src",
  "javascript",
  "events.js"
))

const { loadLanguage, getTranslation } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "languages.js"
  )),
  { getFormat, getLanguageName, updateCodeMode } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "format.js"
  )),
  screens = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "screens.js"
  )),
  updater = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "updater.js"
  ))
graviton.setTheme = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "theming.js"
)).setTheme

const Settings = require(path.join(
    __dirname,
    "src",
    "javascript",
    "windows",
    "settings.js"
  )).Settings,
  Welcome = require(path.join(
    __dirname,
    "src",
    "javascript",
    "windows",
    "welcome.js"
  )).Welcome,
  Setup = require(path.join(
    __dirname,
    "src",
    "javascript",
    "windows",
    "setup.js"
  )).Setup,
  Market = require(path.join(
    __dirname,
    "src",
    "javascript",
    "windows",
    "market.js"
  )).Market,
  Plugins = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "plugins.js"
  )).Plugins,
  Menus = require(path.join(__dirname, "src", "javascript", "api", "menus.js")).Menus,
  Explorer = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "explorer.js"
  )).Explorer,
  Control = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "constructors",
    "control.js"
  )).Control,
  { Dialog, closeDialog } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "constructors",
    "dialogs.js"
  )),
  { Window, closeWindow } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "constructors",
    "windows.js"
  )),
  { Notification, closeNotification } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "constructors",
    "notifications.js"
  )),
  { Tab, closeTab, loadTab } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "tabs.js"
  )),
  dropMenu = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "constructors",
    "dropmenus.js"
  )).Dropmenu
let { icons } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "constructors",
  "icons.js"
))

const { commander, commanders } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "constructors",
  "commanders.js"
))
const { Panel } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "constructors",
  "panels.js"
))
window.customElements.define(
  "gv-switch",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "web_components",
    "switch.js"
  ))
)
window.customElements.define(
  "gv-navpanel",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "web_components",
    "navpanel.js"
  ))
)
require(path.join(__dirname, "src", "javascript", "npm", "npm_panel.js"))
window.customElements.define(
  "gv-process",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "web_components",
    "process_bar.js"
  ))
)

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
  Mousetrap = require("mousetrap"),
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
  projectTemplates = require(path.join(
    __dirname,
    "src",
    "javascript",
    "templates"
  )),
  sourceDir = __dirname

const default_plugins = [
  "Graviton-Code-Editor/Dark",
  "Graviton-Code-Editor/Arctic"
] //Plugins which are installed in the setup process

if (graviton.isProduction()) {
  DataFolderDir = path.join(getAppDataPath(), ".graviton")
}

if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir) // Create .graviton if it doesn't exist

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json"),
  configDir = path.join(DataFolderDir, "config.json"),
  plugins_folder = path.join(DataFolderDir, "plugins"),
  plugins_db = path.join(DataFolderDir, "plugins_db"),
  market_file = path.join(DataFolderDir, "market.json")

preload([
  "src/icons/folder_opened.svg",
  "src/icons/custom_icons/git.svg",
  "src/icons/custom_icons/node_modules.svg"
])

preloadFont(["editor", "terminal"])

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

const appendBinds = function() {
  Mousetrap.bind("mod+s", function() {
    saveFile()
  })
  Mousetrap.bind("mod+n", function() {
    screens.add()
  })
  Mousetrap.bind("mod+l", function() {
    screens.remove(current_screen.id)
  })
  Mousetrap.bind("mod+e", function() {
    graviton.toggleZenMode()
  })
  Mousetrap.bind("mod+t", function() {
    if (terminal != null) {
      commanders.show(terminal.id)
      return
    }
    commanders.terminal()
  })
  Mousetrap.bind("mod+u", function() {
    commanders.closeTerminal()
  })
  Mousetrap.bind("mod+h", function() {
    if (terminal != null) {
      commanders.hide(terminal.id)
    }
  })
  Mousetrap.bind("f11", function() {
    graviton.toggleFullScreen()
  })
  Mousetrap.bind("mod+tab", function() {
    graviton.toggleMenus()
  })
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
    const object = document.getElementById(id)
    fs.unlink(object.getAttribute("dir"), function(err) {
      if (err) graviton.throwError(err)
      object.remove()
    })
  },
  removeFolder(id) {
    const rimraf = require("rimraf")
    const object = document.getElementById(id)
    rimraf.sync(object.getAttribute("dir"))
    object.remove()
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

function registerNewProject(dir) {
  // Add a new directory to the history if it is the first time it has been opened in the editor
  for (i = 0; i < log.length + 1; i++) {
    if (i != log.length) {
      if (log[i].Path == dir) {
        return
      }
    } else if (i == log.length) {
      log.unshift({
        Name: path.basename(dir),
        Path: dir
      })
      document.dispatchEvent(graviton.events.newRecentProject(dir))
      fs.writeFile(logDir, JSON.stringify(log, null, 2))
      return
    }
  }
}

function createNewProject(template) {
  const { dialog } = remote
  dialog
    .showOpenDialog(g_window, {
      properties: ["openDirectory"]
    })
    .then(result => {
      console.log(result.filePaths)
      if (result.canceled) return
      if (result.filePaths != 0) {
        switch (template) {
          case "html":
            const newProjectDir = path.join(
              result.filePaths[0],
              ".GravitonProject " + Date.now()
            )
            fs.mkdirSync(newProjectDir)
            fs.writeFile(
              path.join(newProjectDir, "index.html"),
              projectTemplates.html,
              err => {
                if (err) {
                  return err
                }
                Explorer.load(newProjectDir, "g_directories", true)
              }
            )
            break
        }
      }
    })
    .catch(err => {
      console.error(err)
    })
}

const selectionFromTo = (parent, toSelect) => {
  const children = parent.children
  for (let child of children) {
    child.classList.remove("active")
  }
  if (toSelect != undefined) toSelect.classList.add("active")
}

g_window.on("blur", function() {
  if (graviton.currentOS().codename === "darwin") {
    document.getElementById("controls_macOS").classList.toggle("blur")
  }
})
g_window.on("focus", function() {
  if (graviton.currentOS().codename === "darwin") {
    document.getElementById("controls_macOS").classList.remove("blur")
  }
})
