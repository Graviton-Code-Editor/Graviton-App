/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

const GravitonInfo = {
  date: "191101",
  version: "1.2.0",
  state: "Beta"
};
const fs = require("fs-extra"),
  remote = require("electron").remote,
  BrowserWindow = require("electron").BrowserWindow,
  app = remote.remote,
  getAppDataPath = require("appdata-path"),
  { webFrame } = require("electron"),
  g_window = remote.getCurrentWindow(),
  { systemPreferences } = remote,
  CodeMirror = require("codemirror"),
  semver = require("semver"),
  tinycolor = require("tinycolor2"),
  EventEmitter = require("events");

require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "codemirror-langs.js"
)).langs(); //Load CodeMirror files
const { elasticContainerComponent, elasticContainer } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "components",
  "elastic_container.js"
));

window.customElements.define("elastic-container", elasticContainerComponent);

graviton.loadEditor = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "editors.js"
)).loadEditor;

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
  ));
graviton.setTheme = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "theming.js"
)).setTheme;

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
  NewProject = require(path.join(
    __dirname,
    "src",
    "javascript",
    "windows",
    "new_project.js"
  )).NewProject,
  Plugins = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "plugins.js"
  )).Plugins,
  Menus = require(path.join(__dirname, "src", "javascript", "api", "menus.js"))
    .Menus,
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
    "components",
    "control.js"
  )).Control,
  { Dialog, closeDialog } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "dialogs.js"
  )),
  { Window, closeWindow } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "windows.js"
  )),
  { Notification, closeNotification } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "notifications.js"
  )),
  { Tab, closeTab, loadTab } = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "tabs.js"
  )),
  dropMenu = require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "dropmenus.js"
  )).Dropmenu;
let { icons } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "components",
  "icons.js"
));

const { commander, commanders } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "components",
  "commanders.js"
));
const { Panel } = require(path.join(
  __dirname,
  "src",
  "javascript",
  "api",
  "components",
  "panels.js"
));
window.customElements.define(
  "gv-switch",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "switch.js"
  ))
);
window.customElements.define(
  "gv-navpanel",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "gv_navbar.js"
  ))
);
require(path.join(__dirname, "src", "javascript", "npm", "npm_panel.js"));
window.customElements.define(
  "gv-process",
  require(path.join(
    __dirname,
    "src",
    "javascript",
    "api",
    "components",
    "process_bar.js"
  ))
);

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
  full_plugins = [],
  projectServices = [];

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

document.addEventListener("graviton_loaded", () => {
  /**
   * @desc The resizer between the explorer panel and the editors
   */
  const element = document.getElementById("editor_resizer");
  element.addEventListener("mousedown", initialiseResize, false);

  function initialiseResize(e) {
    window.addEventListener("mousemove", startResizing, false);
    window.addEventListener("mouseup", stopResizing, false);
  }

  function startResizing(e) {
    const explorer = document.getElementById("explorer_app");
    const content_app = document.getElementById("content_app");
    if (current_config.explorerPosition === "left") {
      explorer.style = `width: ${e.clientX - 3}px`;
    } else {
      explorer.style = `width: ${content_app.clientWidth - e.clientX}px`;
    }
    for (i = 0; i < editors.length; i++) {
      editors[i].object.blur();
    }
    graviton.resizeTerminals();
  }
  function stopResizing(e) {
    window.removeEventListener("mousemove", startResizing, false);
    window.removeEventListener("mouseup", stopResizing, false);
  }
});

preload([
  "src/icons/folder_opened.svg",
  "src/icons/custom_icons/git.svg",
  "src/icons/custom_icons/node_modules.svg"
]);

preloadFont(["editor", "terminal"]);

window.onload = function() {
  fs.readdir(path.join(__dirname, "src", "templates"), (err, paths) => {
    /* Load UI templates */
    let temporal_count = 0;
    paths.forEach((dir, index) => {
      fs.readFile(
        path.join(__dirname, "src", "templates", dir),
        "utf8",
        function(err, data) {
          templates[path.basename(dir, ".js")] = data;
          temporal_count++;
          document.getElementById("boot_loader").children[0].style.width =
            temporal_count + 20 + "%";
          if (temporal_count == paths.length) {
            fs.readdir(path.join(__dirname, "languages"), (err, paths) => {
              /* Load languages */
              let path_count = 0;
              paths.forEach((dir, index) => {
                languages.push(require(path.join(__dirname, "languages", dir)));
                path_count++;
                if (paths.length === path_count) {
                  graviton.loadControlButtons();
                  loadConfig();
                  graviton.consoleInfo("All templates have been loaded.");
                  if (document.getElementById("boot_loader") !== null)
                    document.getElementById("boot_loader").children[0].style =
                      "width: 100%; border-radius:100px;";
                }
              });
            });
          }
        }
      );
    });
  });
};

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
  const { dialog } = remote;
  dialog
    .showSaveDialog(g_window)
    .then(result => {
      if (result.canceled) return;
      fs.writeFile(result.filePath, editor.getValue())
        .then(() => {
          filepath = result.filePath;
          new Notification({
            title: "Graviton",
            content: `The file has been succesfully saved in ${result.filePath}`
          });
        })
        .catch(err => {
          if (err) {
            alert(`An error ocurred creating the file ${err.message}`);
            return;
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
}

function openFile() {
  const { dialog } = remote;
  dialog
    .showOpenDialog(g_window, {
      properties: ["openFile", "multiSelections"]
    })
    .then(result => {
      if (result.canceled) return;
      result.filePaths.forEach(file => {
        new Tab({
          id: Math.random() + file.replace(/\\/g, "") + "B",
          path: file,
          name: file,
          type: "file"
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
}
function openFolder() {
  const { dialog } = remote;
  dialog
    .showOpenDialog(g_window, {
      properties: ["openDirectory"]
    })
    .then(result => {
      if (result.canceled) return;
      console.log("dsf");
      Explorer.load(result.filePaths[0], "g_directories", true);
    })
    .catch(err => {
      console.log(err);
    });
}

function saveFile() {
  const { dialog } = remote;
  if (graviton.getCurrentEditor() === null) return;
  if (graviton.getCurrentEditor().editor === undefined) return;
  fs.writeFile(filepath, editor.getValue())
    .then(() => {
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
    })
    .catch(err => {
      console.err(err);
    });
}

const create = {
  folder(id, value) {
    const element = document.getElementById(id);
    const dir = path.join(element.getAttribute("dir"), value);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      Explorer.load(
        element.getAttribute("dir"),
        element.id,
        element.getAttribute("global")
      );
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError2")
      });
    }
  },
  file(id, value) {
    const element = document.getElementById(id);
    const dir = path.join(element.getAttribute("dir"), value);
    if (!fs.existsSync(dir)) {
      fs.writeFile(dir, "", function() {
        Explorer.load(
          element.getAttribute("dir"),
          element.id,
          element.getAttribute("global")
        );
      });
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError1")
      });
    }
  }
};

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
            );
          },
          important: true
        }
      }
    });
    document
      .getElementById("rename_dialog")
      .addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          create.folder(object, this.value === "" ? "New folder" : this.value);
          closeDialog("new_folder");
        }
      });
    document.getElementById("rename_dialog").focus();
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
            );
          },
          important: true
        }
      }
    });
    document
      .getElementById("rename_dialog")
      .addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          create.file(object, this.value === "" ? "NewFile.txt" : this.value);
          closeDialog("new_file");
        }
      });
    document.getElementById("rename_dialog").focus();
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
            directories.removeFile(object.id);
          }
        }
      }
    });
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
            directories.removeFolder(object.id);
          }
        }
      }
    });
  },
  removeFile(id) {
    const object = document.getElementById(id);
    fs.unlink(object.getAttribute("dir"), function(err) {
      if (err) graviton.throwError(err);
      object.remove();
    });
  },
  removeFolder(id) {
    const rimraf = require("rimraf");
    const object = document.getElementById(id);
    rimraf.sync(object.getAttribute("dir"));
    object.remove();
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
          return path.join(themeObject.name, themeObject.icons["node_modules"]);
          break;
        case ".git":
          return path.join(themeObject.name, themeObject.icons["git"]);
          break;
        default:
          if (state == "close") {
            return path.join(
              themeObject.name,
              themeObject.icons["folder_closed"]
            );
          } else {
            return path.join(
              themeObject.name,
              themeObject.icons["folder_opened"]
            );
          }
      }
    }
  }
};

const registerNewProject = function(dir) {
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
      const recent_project_event = new CustomEvent("new_recent_project", {
        detail: {
          name: path.basename(dir),
          path: dir
        }
      });
      document.dispatchEvent(recent_project_event);
      fs.writeFile(logDir, JSON.stringify(log));
      return;
    }
  }
};

const createNewProject = function(template) {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory"]
    },
    selectedFiles => {
      if (selectedFiles.length != 0) {
        switch (template) {
          case "html":
            const g_project_dir = path.join(
              selectedFiles[0],
              ".GravitonProject " + Date.now()
            );
            fs.mkdirSync(g_project_dir);
            fs.writeFile(
              path.join(g_project_dir, "index.html"),
              graviton.getTemplate("html_project"),
              err => {
                if (err) {
                  return err;
                }
                Explorer.load(g_project_dir, "g_directories", true);
              }
            );
            break;
        }
      }
    }
  );
};

const installCli = function() {
  const npm = require("npm");
  npm.load(
    {
      global: true
    },
    function(er) {
      if (er) return er;
      npm.commands.install(["graviton-cli"], function(er, data) {
        if (er) return er;
        console.log("Graviton CLI has been installed!");
      });
    }
  );
};

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
graviton.refreshCustomization = () => {
  document.documentElement.style.setProperty(
    "--editor-font-size",
    `${current_config.fontSizeEditor}px`
  ); // Update settings from start
  webFrame.setZoomFactor(current_config.appZoom / 25);
  if (current_config.blurPreferences != 0) {
    document.documentElement.style.setProperty(
      "--blur",
      `${current_config.blurPreferences}px`
    );
  } else {
    document.documentElement.style.setProperty("--blur", `none`);
  }
};

const selectionFromTo = (parent, toSelect) => {
  const children = parent.children;
  for (let child of children) {
    child.classList.remove("active");
  }
  toSelect.classList.add("active");
};

/**
 * @desc Language  indicator and Line/Char counter Controls
 */
document.addEventListener("screen_loaded", e => {
  const screen = e.detail.screen;
  function refreshStats(id = current_screen.id) {
    if (id != screen) return;
    langController.setText(graviton.getLanguage());
    langController.setHint(`Current: ${graviton.getLanguage()}`);
    if (editor == undefined) {
      counter.hide();
      return;
    }
    if (graviton.getCurrentTab().getAttribute("typeeditor") === "free") {
      langController.hide();
    }
    counter.show();
    langController.show();
    counter.setText(
      editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1)
    );
    counter.setHint(
      `Line ${editor.getCursor().line + 1} , Char ${Number(
        editor.getCursor().ch + 1
      )}`
    );
    editor.on("cursorActivity", function(a) {
      counter.setText(
        editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1)
      );
      counter.setHint(
        `Line ${editor.getCursor().line + 1} , Char ${Number(
          editor.getCursor().ch + 1
        )}`
      );
      counter.show();
    });
  }
  let langController = new Control({
    text: graviton.getLanguage(),
    hint: `Current: ${graviton.getLanguage()}`
  });
  if (editor != undefined) {
    var counter = new Control({
      text:
        editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1),
      hint: `Line ${editor.getCursor().line + 1} , Char ${Number(
        editor.getCursor().ch + 1
      )}`
    });
    refreshStats();
  } else {
    var counter = new Control({
      text: ""
    });
    counter.hide();
    refreshStats();
  }
  document.addEventListener("tab_loaded", e => {
    refreshStats(e.detail.screen);
  });
  document.addEventListener("tab_closed", e => {
    refreshStats(e.detail.screen);
  });
  document.addEventListener("tab_created", () => {
    refreshStats();
  });
});

projectServices.push({
  name: "HTML",
  description: "Basic HTML project",
  onclick: () => createNewProject("html")
});

const EXPLORER_PANEL = new Panel({
  minHeight: "",
  content: `
  <div style="height:100%;">
      <span id="openFolder" height="24px" width="24px" onclick="openFolder()"></span>
      </div>
  `
});
