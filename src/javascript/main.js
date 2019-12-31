/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

const GravitonInfo = {
  date: "191231",
  version: "1.3.0",
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

graviton.editorClient = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "editors.js"
)).editorClient




graviton.closeCommander = require(path.join(
  __dirname,
  "src",
  "javascript",
  "components",
  "global",
  "commander.js"
)).closeCommander

const CommandLauncher = require(path.join(
  __dirname,
  "src",
  "javascript",
  "components",
  "global",
  "commander.js"
)).CommandLauncher

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
graviton.loadKeyShortcuts = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "shortcuts.js"
));

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
  projectTemplates = require(path.join(
    __dirname,
    "src",
    "javascript",
    "templates"
  )),
  sourceDir = __dirname,
  GravitonCommander = null

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

/**
 * @desc CodeMirror client instance
*/

document.addEventListener("graviton_loaded",function(){
  new graviton.editorClient({
    name: "codemirror",
    onKeyDown(func){
      editor.on('keydown',func)
    },
    onChange(func){
      editor.on('change',func)
    },
    onCursorActivity(func){
      editor.on('cursorActivity',func)
    },
    getCursor(){
      const value = editor.getCursor()
      return {line:value.line,column:value.ch}
    },
    getValue(){
      return editor.getValue()
    },
    openFind(){
      CodeMirror.commands.find(editor);
    },
    openReplace(){
      CodeMirror.commands.replace(editor);
    },
    openJumpToLine(){
      CodeMirror.commands.jumpToLine(editor);
    },
    setLanguage(language){
      switch(language){
        case "json":
          editor.setOption('mode', 'application/json')
          editor.setOption('htmlMode', false)
          break;
        case "html":
          editor.setOption('mode', 'htmlmixed')
          editor.setOption('htmlMode', false)
          break;
        case "cpp":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'text/x-c++src')
          break;
        case "cs":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'text/x-csharp')
          break;
        case "java":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'text/x-java')
          break;
        case "objectivec":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'text/x-objectivec') 
          break;
        case "kotlin":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'text/x-kotlin')
          break;
        case "typescript":
          editor.setOption('htmlMode', false)
          editor.setOption('mode', 'application/typescript')
          break;
        default:
          editor.setOption('mode', language)
          editor.setOption('htmlMode', true)
      }     
    },
    onContentChanged(func){
      editor.on('change',func)
    },
    forceRefresh(){
      editor.refresh()
    },
    getValue(){
      return editor.getValue()
    },
    goToLine({line,char}){
      editor.setCursor(line, char)
      editor.scrollIntoView({line:line, char:char}, 300)
    },
    onLoadTab(clientConf){
      let codemirror = CodeMirror(
        document.getElementById(clientConf.textContainer.id),
        {
          value: clientConf.data,
          mode: 'text/plain',
          htmlMode: false,
          theme:
            themeObject['highlight'] != undefined
              ? themeObject['highlight']
              : 'default',
          lineNumbers: true,
          autoCloseTags: true,
          indentWithTabs: true,
          indentUnit: 2,
          tabSize: 2,
          id: clientConf.dir.replace(/\\/g, '') + '_editor',
          screen: clientConf.screen,
          styleActiveLine: { nonEmpty: true },
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          lineWrapping:
            current_config['lineWrappingPreferences'] == 'activated',
          autoCloseBrackets: true,
          matchBrackets: true,
          matchTags: { bothTags: true },
          styleActiveLine: { nonEmpty: true },
          styleActiveSelected: true,
          foldGutter:true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        }
      )
      codemirror.focus()
      const new_editor_text = {
        object: clientConf.textContainer,
        id: clientConf.textContainer.id,
        editor: codemirror,
        path: clientConf.dir,
        screen: clientConf.screen,
        type: clientConf.type
      }
      clientConf.textContainer.focus()
      elasticContainer.append(
        clientConf.textContainer.children[0].children[
          Number(clientConf.textContainer.children[0].children.length - 1)
        ]
      )
      clientConf.textContainer.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
          if (e.deltaY < 0) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) + 1}`
            )
          } else if (e.deltaY > 0) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) - 1}`
            )
          }
        }
      })
      editorID = new_editor_text.id
      editor = new_editor_text.editor
      clientConf.textContainer.style.display = 'block'
      codemirror.on('cursorActivity', function (cm) {
        editor = cm
        editorID = cm.options.id
        for (let b = 0; b < tabs.length; b++) {
          if (
            tabs[b].getAttribute('screen') == cm.options.screen &&
            tabs[b].classList.contains('selected')
          ) {
            editingTab = tabs[b].id
            filepath = tabs[b].getAttribute('longpath')
          }
        }
        graviton.closeDropmenus()
        graviton.focusScreen(cm.options.screen)
      })
      graviton.focusScreen(screen)

      function filterIt (arr, searchKey, cb) {
        let list = []
        for (i = 0; i < arr.length; i++) {
          const curr = arr[i]
          Object.keys(curr).some(function (key) {
            if (typeof curr[key] === 'string' && curr[key].includes(searchKey)) {
              list.push(curr)
            }
          })
        }
        return cb(list)
      }
      if (codemirror != undefined) {
        codemirror.on("change", function () {
          if (current_config['autoCompletionPreferences'] == 'activated') {
            function checkVariables(text) {
              let _variables = []
              for (i = 0; i < text.length; i++) {
                switch (codemirror.getMode().name) {
                  case "javascript":
                    switch (text[i]) {
                      case "let":
                      case "var":
                      case "const":
                        _variables.push({
                          _name: text[i + 1]
                        })
                        break
                      case "{":
                        _variables.push({
                          _name: text[i + 1]
                        })
                        break
                    }
                    break
                  case "java":
                    switch (text[i]) {
                      case "int":
                      case "char":
                      case "float":
                        _variables.push({
                          _name: text[i + 1]
                        })
                        break
                    }
                    break
                }
              }
              return _variables
            }
            elasticContainer.append(document.getElementById('context'))
            const cursorPos = codemirror.cursorCoords()
            const A1 = codemirror.getCursor().line
            const A2 = codemirror.getCursor().ch
            const B1 = codemirror.findWordAt({
              line: A1,
              ch: A2
            }).anchor.ch
            const B2 = edicodemirroror.findWordAt({
              line: A1,
              ch: A2
            }).head.ch
            const lastWord = codemirror.getRange(
              {
                line: A1,
                ch: B1
              },
              {
                line: A1,
                ch: B2
              }
            )
            const context = document.getElementById('context')
            if (context.style.display == 'block') return
            const selectedLangNum = (function () {
              for (i = 0; i < dictionary.length; i++) {
                if (
                  dictionary[i].name ==
                  path
                    .basename(graviton.getCurrentFile().path)
                    .split('.')
                    .pop()
                ) {
                  return i
                }
              }
            })()
            if (selectedLangNum == undefined) return
            let dic = dictionary[selectedLangNum].list
            const vars = checkVariables(
              codemirror
                .getValue()
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .split (
                  /\s|(\()([\w\s+!?="`[<>,\/*':&.`$;_-{}]+)(\))|\s|(\<)([\w\s!?="`[,\/*()':&.;_-{}]+)(\>)|\s|(\()([\w\s!?="<>`[,'+:&.;_-{}]+)(\))\s|(\B\$)(\w+)|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="+<>`[\/'*,$.;_-{}]+)(%%)|("[\w\s!?()='.`;_-{}]+")/g
                )
                .filter(Boolean)
            )
            dic = dic.concat(vars)
            filterIt(dic, lastWord, function (filterResult) {
              if (filterResult.length > 0 && lastWord.length >= 3) {
                let contextOptions
                for ( i = 0; i < filterResult.length; i++) {
                  const id = Math.random()
                  contextOptions += `
                  <div class=option>
                    <button id=${id}  >
                      ${filterResult[i]._name}
                    </button>
                    <p></p>
                  </div>`
                  contextOptions = contextOptions.replace('undefined', '')
                  context.innerHTML = contextOptions
                  sleeping(1).then(() => {
                    if (document.getElementById(id) == null) return
                    document.getElementById(id).onclick = function () {
                      const A1 = codemirror.getCursor().line
                      const A2 = codemirror.getCursor().ch
                      const B1 = codemirror.findWordAt({
                        line: A1,
                        ch: A2
                      }).anchor.ch
                      const B2 = codemirror.findWordAt({
                        line: A1,
                        ch: A2
                      }).head.ch
                      const selected = this.innerText
                      codemirror.replaceRange(
                        selected,
                        {
                          line: A1,
                          ch: B1
                        },
                        {
                          line: A1,
                          ch: B2
                        }
                      )
                      context.parentElement.style.display = 'none'
                      context.innerHTML = ''
                    }
                  })
                }
                context.parentElement.style = `top:${cursorPos.top +
                  30}px; left:${cursorPos.left}px; display:block;`
                if (cursorPos.top < window.innerHeight / 2) {
                } // Cursor is above the mid height
                context.children[0].classList.add('hover')
              } else if (filterResult.length === 0 || lastWord.length < 3) {
                context.parentElement.style.display = 'none'
                context.innerHTML = ''
              }
            })
          }
        })
        codemirror.on('keydown', function (editor, e) {
          if (
            document.getElementById('context').parentElement.style.display !=
            'none'
          ) {
            codemirror.setOption('extraKeys', {
              Up: function () {
                return CodeMirror.PASS
              },
              Down: function () {
                return CodeMirror.PASS
              },
              Enter: function () {
                return CodeMirror.PASS
              },
              Tab: function () {
                return CodeMirror.PASS
              }
            })
          } else {
            codemirror.setOption('extraKeys', {
              Up: 'goLineUp',
              Down: 'goLineDown'
            })
          }
          const context = document.getElementById('context')
          const childs = context.querySelectorAll('.option')
          for (i = 0; i < childs.length; i++) {
            if (childs[i].classList.contains('hover')) {
              if (
                e.keyCode === 40 &&
                i != childs.length - 1 &&
                context.style.display != 'none'
              ) {
                // DOWN
                childs[i].classList.remove('hover')
                childs[i + 1].classList.add('hover')
                context.scrollBy(0, 30)
                return false
              } else if (
                e.keyCode === 38 &&
                i != 0 &&
                context.style.display != 'none'
              ) {
                // UP
                childs[i].classList.remove('hover')
                childs[i - 1].classList.add('hover')
                context.scrollBy(0, -30)
                return false
              }
              if (e.keyCode === 9 || e.keyCode === 13) {
                // 9 = Tab & 13 = Enter
                const A1 = codemirror.getCursor().line
                const A2 = codemirror.getCursor().ch
                const B1 = codemirror.findWordAt({
                  line: A1,
                  ch: A2
                }).anchor.ch
                const B2 = codemirror.findWordAt({
                  line: A1,
                  ch: A2
                }).head.ch
                const selected = (function () {
                  for (i = 0; i < childs.length; i++) {
                    if (childs[i].classList.contains('hover')) {
                      return `${childs[i].innerText}`
                    }
                  }
                })()
                codemirror.replaceRange(
                  selected,
                  {
                    line: A1,
                    ch: B1
                  },
                  {
                    line: A1,
                    ch: B2
                  }
                )
                context.innerHTML = ''
                setTimeout(function () {
                  context.parentElement.style.display = 'none'
                  context.innerHTML = ''
                }, 1)
              }
            }
          }
        })
        codemirror.addKeyMap({
          'Ctrl-Up': function (cm) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) + 2}`
            )
          },
          'Ctrl-Down': function (cm) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) - 2}`
            )
          }
        })
      }

      return codemirror
    }
  })
  
})