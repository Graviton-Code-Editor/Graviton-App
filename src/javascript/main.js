/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_version = {
  date: "190730",
  version: "1.0.3",
  state: "Beta"
};
const os = require("os"),
  { shell } = require("electron"),
  fs = require("fs-extra"),
  { dialog } = require("electron").remote,
  remote = require("electron").remote,
  BrowserWindow = require("electron").BrowserWindow,
  app = require("electron").remote,
  getAppDataPath = require("appdata-path"),
  { webFrame } = require("electron"),
  g_window = require("electron").remote.getCurrentWindow(),
  { systemPreferences } = require("electron").remote,
  url = require("url"),
  marked = require("marked"),
  updater = require("./src/javascript/updater") /*Import the update module*/,
  fit = require("./node_modules/xterm/lib/addons/fit/fit.js");
let current_screen,
  dir_path,
  i,
  DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton"),
  tabs = [],
  FirstFolder = null,
  editingTab,
  plang = " ",
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
  dictionary = autocomplete;
if(!path.basename(__dirname)==("Graviton-Editor" || "Graviton-App")){
  DataFolderDir = path.join(getAppDataPath(), ".graviton");
}

if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir); // Create .graviton if it doesn't exist

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json"),
  configDir = path.join(DataFolderDir, "config.json"),
  timeSpentDir = path.join(DataFolderDir, "_time_spent.json"),
  themes_folder = path.join(DataFolderDir, "themes"),
  highlights_folder = path.join(DataFolderDir, "highlights"),
  plugins_folder = path.join(DataFolderDir, "plugins"),
  plugins_db = path.join(DataFolderDir, "plugins_db");

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
      explorer.style = `width: ${event.clientX - 3}px`;
      for(i=0;i<editors.length;i++){
        editors[i].object.blur()
      }
      graviton.resizeTerminals();
    }
  },
  true
);


function updateTitle(text) {
  if (graviton.currentOS().codename == "win32") {
    document.getElementById("title_directory").children[0].innerText =
      text + " · Graviton";
  } else {
    g_window.setTitle(text + " · Graviton");
  }
}
updateTitle(`v${g_version.version}`); //Initial title
const loadEditor = info => {
  if (
    document.getElementById(info.dir.replace(/\\/g, "") + "_editor") ==
    undefined
  ) {
    switch (info.type) {
      case "text":
        const text_container = document.createElement("div");
        text_container.classList = "code-space";
        text_container.setAttribute(
          "id",
          info.dir.replace(/\\/g, "") + "_editor"
        );
        text_container.setAttribute("path", info.dir);
        document
          .getElementById(current_screen.id)
          .children[1].appendChild(text_container);
        let codemirror = CodeMirror(
          document.getElementById(text_container.id),
          {
            value: info.data,
            mode: "text/plain",
            htmlMode: false,
            theme:
              themeObject["highlight"] != undefined
                ? themeObject["highlight"]
                : "default",
            lineNumbers: true,
            autoCloseTags: true,
            indentUnit: 2,
            id: info.dir,
            styleActiveLine: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lineWrapping:
              current_config["lineWrappingPreferences"] == "activated"
          }
        );
        document.getElementById(
          current_screen.id
        ).children[2].children[0].innerText = getLanguageName(
          getFormat(path.basename(info.dir)) != "unknown"
            ? getFormat(path.basename(info.dir))
            : path
                .basename(info.dir)
                .split(".")
                .pop()
        );
        const new_editor_text = {
          object: text_container,
          id: text_container.id,
          editor: codemirror,
          path: info.dir,
          screen: info.screen,
          type: info.type
        };
        elasticContainer.append(text_container.children[0].children[5])
        editors.push(new_editor_text);
        if (g_highlighting == "activated") updateCodeMode(codemirror, info.dir);
        for (i = 0; i < editors.length; i++) {
          if (
            editors[i].screen == info.screen &&
            document.getElementById(editors[i].id) != null
          ) {
            document.getElementById(editors[i].id).style.display = "none";
          }
        }
        editorID = new_editor_text.id;
        editor = new_editor_text.editor;
        text_container.style.display = "block";
        codemirror.on("focus", function(a) {
          for (i = 0; i < editors.length; i++) {
            if (editors[i].id == a.options.id.replace(/[\\\s]/g, "") + "_editor") {
              editor = editors[i].editor;
              editorID = editors[i].id;
              for (let b = 0; b < tabs.length; b++) {
                if (
                  tabs[b].getAttribute("screen") == editors[i].screen &&
                  tabs[b].classList.contains("selected")
                ) {
                  editingTab = tabs[b].id;
                  filepath = tabs[b].getAttribute("longpath");
                }
              }
            }
          }
        });
        break;
      case "image":
        const image_container = document.createElement("div");
        image_container.classList = "code-space";
        image_container.setAttribute(
          "id",
          `${info.dir.replace(/\\/g, "")}_editor`
        );
        image_container.innerHTML = `<img src="${info.dir}">`;
        document
          .getElementById(current_screen.id)
          .children[1].appendChild(image_container);
        const new_editor_image = {
          id: info.dir.replace(/\\/g, "") + "_editor",
          editor: undefined,
          path: info.dir,
          screen: info.screen
        };
        for (i = 0; i < editors.length; i++) {
          if (
            editors[i].screen == info.screen &&
            document.getElementById(editors[i].id) != null
          ) {
            document.getElementById(editors[i].id).style.display = "none";
          }
        }
        editors.push(new_editor_image);
        document.getElementById(
          info.dir.replace(/\\/g, "") + "_editor"
        ).style.display = "block";
        editorID = new_editor_image.id;
        document.getElementById(
          current_screen.id
        ).children[2].children[0].innerText = "Image";
        break;
      case "free":
        const free_id = "free_tab" + Math.random();
        const free_container = document.createElement("div");
        free_container.classList = "code-space";
        free_container.setAttribute(
          "id",
          `${info.dir.replace(/\\/g, "")}_editor`
        );
        free_container.innerHTML = info.data != undefined ? info.data : "";
        document
          .getElementById(current_screen.id)
          .children[1].appendChild(free_container);
        const new_editor_free = {
          id: info.dir.replace(/\\/g, "") + "_editor",
          editor: null,
          path: null,
          screen: info.screen,
          type: "free"
        };
        for (i = 0; i < editors.length; i++) {
          if (
            editors[i].screen == info.screen &&
            document.getElementById(editors[i].id) != null
          ) {
            document.getElementById(editors[i].id).style.display = "none";
          }
        }
        editors.push(new_editor_free);
        document.getElementById(
          info.dir.replace(/\\/g, "") + "_editor"
        ).style.display = "block";
        editorID = new_editor_free.id;
        document.getElementById(
          current_screen.id
        ).children[2].children[0].innerText = " ";
        break;
    }
  } else {
    // Editor exists
    for (i = 0; i < editors.length; i++) {
      if (
        editors[i].screen == info.screen &&
        document.getElementById(editors[i].id) != null
      ) {
        document.getElementById(editors[i].id).style.display = "none";
      }
      if (editors[i].id == info.dir.replace(/\\/g, "") + "_editor") {
        if (editors[i].editor != undefined) {
          // Editors
          editor = editors[i].editor;
          document.getElementById(
            info.screen
          ).children[2].children[0].innerText = getLanguageName(
            getFormat(path.basename(info.dir)) != "unknown"
              ? getFormat(path.basename(info.dir))
              : path
                  .basename(info.dir)
                  .split(".")
                  .pop()
          );
        } else if (info.type != "free") {
          // Images
          document.getElementById(
            info.screen
          ).children[2].children[0].innerText = "Image";
        } else {
          document.getElementById(
            info.screen
          ).children[2].children[0].innerText = "";
        }
        editorID = editors[i].id;
        document.getElementById(editorID).style.display = "block";
        if (editor != undefined) editor.refresh();
      }
    }
  }

  function filterIt(arr, searchKey, cb) {
    var list = [];
    for (var i = 0; i < arr.length; i++) {
      var curr = arr[i];
      Object.keys(curr).some(function(key) {
        if (typeof curr[key] === "string" && curr[key].includes(searchKey)) {
          list.push(curr);
        }
      });
    }
    return cb(list);
  }
  if (editor != undefined) {
    editor.on("change", function() {
      const close_icon = document.getElementById(editingTab);
      close_icon.setAttribute("file_status", "unsaved");
      close_icon.children[1].innerHTML = icons["unsaved"];
      document
        .getElementById(editingTab)
        .setAttribute("data", editor.getValue());
      if (current_config["autoCompletionPreferences"] == "activated") {
        const cursorPos = editor.cursorCoords();
        const A1 = editor.getCursor().line;
        const A2 = editor.getCursor().ch;
        const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
        const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
        const lastWord = editor.getRange(
          { line: A1, ch: B1 },
          { line: A1, ch: B2 }
        );
        const context = document.getElementById("context");
        if (context.style.display == "block") return;
        const selectedLangNum = (function() {
          for (i = 0; i < dictionary.length; i++) {
            if (
              dictionary[i].name ==
              path
                .basename(graviton.getCurrentFile().path)
                .split(".")
                .pop()
            ) {
              return i;
            }
          }
        })();
        if(selectedLangNum==undefined) return;
        let dic = dictionary[selectedLangNum].list;
        const vars = look(
          editor.getValue()
          .replace (/(\r\n|\n|\r)/gm, ' ')
          .split (
            /\s|(\()([\w\s!?="`[<>,\/*':&.;_-{}]+)(\))|\s|(\<)([\w\s!?="`[,\/*()':&.;_-{}]+)(\>)|\s|(\()([\w\s!?="<>`[,'+:&.;_-{}]+)(\))\s|(\B\$)(\w+)|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="+<>`[\/'*,.;_-{}]+)(%%)|("[\w\s!?()='.`;_-{}]+")/g
          ).filter(Boolean)
        )
        dic = dic.concat(vars)
        filterIt(dic, lastWord, function(
          filterResult
        ) {
          if (filterResult.length > 0 && lastWord.length >= 3) {
            let contextOptions;
            for (var i = 0; i < filterResult.length; i++) {
              const id = Math.random();
              contextOptions +=
                `<button id=${id} class=option > 
                ${filterResult[i]._name}
                </button>`;
              contextOptions = contextOptions.replace("undefined", "");
              context.innerHTML = contextOptions;
              sleeping(1).then(() => {
                if (document.getElementById(id) == null) return;
                document.getElementById(id).onclick = function() {
                  const A1 = editor.getCursor().line;
                  const A2 = editor.getCursor().ch;
                  const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
                  const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
                  const selected = this.innerText;
                  editor.replaceRange(
                    selected,
                    { line: A1, ch: B1 },
                    { line: A1, ch: B2 }
                  );
                  context.parentElement.style.display = "none";
                  context.innerHTML = "";
                };
              });
            }
            context.parentElement.style = `top:${cursorPos.top + 30}px; left:${
              cursorPos.left
            }px; display:block;`;
            if (cursorPos.top < window.innerHeight / 2) {
            } //Cursor is above the mid height
            context.children[0].classList.add("hover");
          } else if (filterResult.length === 0 || lastWord.length < 3) {
            context.parentElement.style.display = "none";
            context.innerHTML = "";
          }
        });
      }
    });
    editor.on("keydown", function(editor, e) {
      if (
        document.getElementById("context").parentElement.style.display != "none"
      ) {
        editor.setOption("extraKeys", {
          Up: function() {
            return CodeMirror.PASS;
          },
          Down: function() {
            return CodeMirror.PASS;
          },
          Enter: function() {
            return CodeMirror.PASS;
          },
          Tab: function() {
            return CodeMirror.PASS;
          },
        });
      } else {
        editor.setOption("extraKeys", {
          Up: "goLineUp",
          Down:"goLineDown"
        });
      }
      const context = document.getElementById("context");
      const childs = context.querySelectorAll(".option");
      for (i = 0; i < childs.length; i++) {
        if (childs[i].classList.contains("hover")) {
          if (
            e.keyCode === 40 &&
            i != childs.length - 1 &&
            context.style.display != "none"
          ) {
            //DOWN
            childs[i].classList.remove("hover");
            childs[i + 1].classList.add("hover");
            context.scrollBy(0, 30);
            return false;
          } else if (
            e.keyCode === 38 &&
            i != 0 &&
            context.style.display != "none"
          ) {
            //UP
            childs[i].classList.remove("hover");
            childs[i - 1].classList.add("hover");
            context.scrollBy(0, -30);
            return false;
          }
          if (e.keyCode === 9 || e.keyCode === 13) {
            //9 = Tab & 13 = Enter
            const A1 = editor.getCursor().line;
            const A2 = editor.getCursor().ch;
            const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
            const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
            const selected = (function() {
              for (i = 0; i < childs.length; i++) {
                if (childs[i].classList.contains("hover")) {
                  return childs[i].innerText;
                }
              }
            })();
            editor.replaceRange(
              selected,
              { line: A1, ch: B1 },
              { line: A1, ch: B2 }
            );
            context.innerHTML = "";
            setTimeout(function() {
              context.parentElement.style.display = "none";
              context.innerHTML = "";
            }, 1);
          }
        }
      }
    });
    editor.addKeyMap({
      "Ctrl-S": function(cm) {
        saveFile();
      },
      "Ctrl-N": function(cm) {
        screens.add();
      },
      "Ctrl-L": function(cm) {
        screens.remove(current_screen.id);
      },
      "Ctrl-E": function(cm) {
        graviton.toggleZenMode();
      },
      "Ctrl-T": function(cm) {
        if (current_screen.terminal != undefined) {
          commanders.show(current_screen.terminal.id);
          return;
        }
        commanders.terminal();
      },
      "Ctrl-U": function(cm) {
        commanders.closeTerminal();
      },
      "Ctrl-H": function(cm) {
        if (current_screen.terminal != undefined) {
          commanders.hide(current_screen.terminal.id);
        }
        commanders.terminal();
      },
      'F11': function(cm) {
        if (g_window.isFullScreen() == false) {
          g_window.setFullScreen(true);
        } else {
          g_window.setFullScreen(false);
        }
      },
      "Ctrl-Q": function(cm) {
        graviton.toggleMenus();
      }
    });
  }
};
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
    if (current_screen.terminal != undefined) {
      commanders.show(current_screen.terminal.id);
      return;
    }
    commanders.terminal();
  });
  Mousetrap.bind("mod+u", function() {
    commanders.closeTerminal();
  });
  Mousetrap.bind("mod+h", function() {
    if (current_screen.terminal != undefined) {
      commanders.hide(current_screen.terminal.id);
    }
  });
  Mousetrap.bind("f11", function() {
    graviton.toggleFullScreen();
  });
  Mousetrap.bind("mod+q", function() {
    graviton.toggleMenus();
  });
};

function save_file_warn(ele) {
  new Dialog({
    id: "saving_file_warn",
    title: current_config.language["Warn"],
    content: current_config.language["FileExit-dialog-message"],
    buttons: {
      [current_config.language[
        "FileExit-dialog-button-accept"
      ]]: {
        click:( )=>{
          console.log(ele);
          closeTab(ele.getAttribute("tabid"),true);
        }
      },
      [current_config.language["Cancel"]]: {},
      [current_config.language["FileExit-dialog-button-deny"]]: {
        click: ()=>{saveFile()},
        important: true
      }
    }
  });
}

function saveFileAs() {
  dialog.showSaveDialog(fileName => {
    fs.writeFile(fileName, editor.getValue(), err => {
      if (err) {
        alert(`An error ocurred creating the file ${err.message}`);
        return;
      }
      filepath = fileName;
      new Notification(
        "Graviton",
        `The file has been succesfully saved in ${fileName}`
      );
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
  dialog.showOpenDialog({ properties: ["openDirectory"] }, selectedFiles => {
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

function loadDirs(dir, app_id, f_t,callback) {
  const first_time =
    f_t == (true || "true") ? true : f_t == "reload" ? false : f_t;
  if (!fs.existsSync(dir)) {
    graviton.throwError(current_config.language["DirectoryDoesntExist"]);
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
    updateTitle(FirstFolder);
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
    Number(document.getElementById(appender_id).getAttribute("myPadding")) + 7; // Add padding
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
        const parent_id =  _long_path.replace(/[\\\s]/g, "") + "_div";
        directory_temp.innerHTML += `
        <div global=reload dir="${_long_path}"   opened="false" ID="${parent_id}" name="${
          paths[i]
        }" style="padding-left:${paddingListDir}px; vertical-align:middle;">
          <div parent=${parent_id}  ID="${parent_id +"_div"}" elementType=directory global=reload dir="${_long_path}"  class="directory" onclick="loadDirs('${_long_path}','${parent_id}',false)">
            <img parent=${parent_id} ID="${parent_id+ "_img"}" elementType=directory global=reload dir="${_long_path}" style="float:left; padding-right:3px; height:22px; width:24px; " src="${directories.getCustomIcon(
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
        const parent_id =  _long_path.replace(/[\\\s]/g, "") +"_div";
        file_temp.innerHTML += `
        <div parent="${parent_id}" elementType="directorie" onclick="new Tab({
          id:'${parent_id + "B"}',
          path:'${_long_path}',
          name:'${paths[i]}',
          type:'file'
        })" myPadding="${paddingListDir}" dir="${_long_path}" class="directory" ID="${parent_id}" name="${
          paths[i]
        }" style=" margin-left:${paddingListDir}px; vertical-align:middle;">
          <img parent="${parent_id}" ID="${parent_id +"_img"}" dir="${_long_path}" elementType="directorie" style="float:left; padding-right:3px; height:24px; width:24px;" src="src/icons/files/${getFormat(
          paths[i]
        )}.svg">
          <p parent="${parent_id}" ID="${parent_id+"_p"}" dir="${_long_path}" elementType="directorie">
          ${paths[i]}
          </p>
        </div>`;
        working_folder.appendChild(file_temp);
      }
    }
    callback!=undefined?callback():"";
  });
}
const create ={
  folder: function(id,value){
    const element =  document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'),value)
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        loadDirs(
          element.getAttribute('dir'),
          element.id,
          element.getAttribute("global")
        ,function(){
          //Created the new folder
        });
    }else{
      new Notification("Graviton",getTranslation("ExplorerError2"))
    }
  },
  file: function(id,value){
    const element =  document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'),value)
    if (!fs.existsSync(dir)){
        fs.writeFile(dir,"",function(){
          loadDirs(
            element.getAttribute('dir'),
            element.id,
            element.getAttribute("global")
          ,function(){
            //callback
          });
        })
    }else{
      new Notification("Graviton",getTranslation("ExplorerError1"))
    }
  }
}

const directories = {
  newFolder: function(object){
    new Dialog({
      id: "new_folder",
      title: current_config.language["Dialog.RenameTo"],
      content: "<div id='rename_dialog' class='section-1' contentEditable> New Folder </div>",
      buttons: {
        [current_config.language["Cancel"]]:{},
        [current_config.language[
          "Accept"
        ]]: {
          click:()=>{
            create.folder(object,document.getElementById('rename_dialog').innerText)
          },
          important:true
        }
      }
    });
  },
  newFile: function(object){
    new Dialog({
      id: "new_file",
      title: current_config.language["Dialog.RenameTo"],
      content: "<div id='rename_dialog' class='section-1' contentEditable> New File.txt </div>",
      buttons: {
        [current_config.language["Cancel"]]: {},
        [current_config.language[
          "Accept"
        ]]: {
          click: ()=>{
            create.file(object,document.getElementById('rename_dialog').innerText); 
          },
          important:true
        }
      }
    });
  },
  removeFileDialog: function(object) {
    new Dialog({
      id: "remove_file",
      title: current_config.language["Dialog.AreYouSure"],
      content: "",
      buttons: {
        [current_config.language["Cancel"]]: {},
        [current_config.language[
          "Accept"
        ]]:{
          click:()=>{
            directories.removeFile(object.id);
          }
        }
      }
    });
  },
  removeFolderDialog: function(object) {
    new Dialog({
      id: "remove_folder",
      title: current_config.language["Dialog.AreYouSure"],
      content: "",
      buttons: {
        [current_config.language["Cancel"]]: {},
        [current_config.language[
          "Accept"
        ]]: {
          click:()=>{
            directories.removeFolder(object.id);
          }
        }
      }
    });
  },
  removeFile: function(id) {
    const object = document.getElementById(id);
    fs.unlink(object.getAttribute("dir"), function(err) {
      if (err) console.error(err);
      object.remove();
    });
  },
  removeFolder: function(id) {
    const rimraf = require("rimraf");
    const object = document.getElementById(id);
    console.log(object);
    rimraf.sync(object.getAttribute("dir"))
    object.remove();
  },
  getCustomIcon: function(path, state) {
    switch (path) {
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
  }
};

/*
  * Used for loading it's icon in the explorer menu
  * Not recognized formats will have the unknown icon as default
*/

function getFormat(text) {
  switch (text.split(".").pop()) {
    case "html":
      return "html";
    case "js":
      return "js";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "md";
    case "ts":
      return "ts";
    case "jpg":
    case "png":
    case "ico":
    case "svg":
      return "image";
    default:
      return "unknown";
  }
}

function getLanguageName(format) {
  switch (format) {
    case "html":
      return "HTML";
    case "css":
      return "CSS";
    case "js":
      return "JavaScript";
    case "jsx":
      return "React JavaScript";
    case "json":
      return "JSON ";
    case "go":
      return "Go";
    case "sql":
      return "SQL";
    case "rb":
    case "ruby":
      return "Ruby";
    case "php":
      return "PHP";
    case "sass":
      return "Sass";
    case "dart":
      return "Dart";
    case "pascal":
      return "Pascal";
    case "md":
      return "Markdown";
    case "py":
      return "Python";
    case "sh":
      return "Shell";
    case "c":
      return "C";
    case "ino":
      return "C";
    case "h":
      return "C";
    case "cpp":
      return "C++";
    case "c++":
      return "C++";
    case "cc":
      return "C++";
    case "cxx":
      return "C++";
    case "hpp":
      return "C++";
    case "h++":
      return "C++";
    case "hh":
      return "C++";
    case "hxx":
      return "C++";
    case "csharp":
      return "C#";
    case "cs":
      return "C#";
    case "java":
      return "Java";
    case "m":
      return "Objective-C";
    case "mm":
      return "Objective-C";
    case "kt":
      return "Kotlin";
    case "ts":
      return "TypeScript";
    case "toml":
    case "rs":
      return "Rust";
    default:
      return format;
  }
}

function updateCodeMode(instance, path) {
  if (g_highlighting == "activated") {
    switch (path.split(".").pop()) {
      case "html":
        instance.setOption("mode", "htmlmixed");
        instance.setOption("htmlMode", true);
        plang = "HTML";
        instance.refresh();
        break;
      case "css":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "css");
        plang = "CSS";
        instance.refresh();
        break;
      case "js":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "javascript");
        plang = "JavaScript";
        instance.refresh();
        break;
      case "jsx":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "jsx");
        plang = "React JavaScript";
        instance.refresh();
        break;
      case "json":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "application/json");
        plang = "JSON / JavaScript";
        instance.refresh();
        break;
      case "go":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "go");
        plang = "Go";
        instance.refresh();
        break;
      case "sql":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "sql");
        plang = "SQL";
        instance.refresh();
        break;
      case "rb":
      case "ruby":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "ruby");
        plang = "Ruby";
        instance.refresh();
        break;
      case "php":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "php");
        plang = "PHP";
        instance.refresh();
        break;
      case "sass":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "sass");
        plang = "Sass";
        instance.refresh();
        break;
      case "dart":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "dart");
        plang = "Dart";
        instance.refresh();
        break;
      case "pascal":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "pascal");
        plang = "Pascal";
        instance.refresh();
        break;
      case "md":
        instance.setOption("htmlMode", true);
        instance.setOption("mode", "markdown");
        plang = "Markdown";
        instance.refresh();
        break;
      case "py":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "python");
        plang = "Python";
        instance.refresh();
        break;
      case "sh":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "shell");
        plang = "Shell";
        instance.refresh();
        break;
      case "c":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-csrc");
        plang = "C";
        instance.refresh();
        break;
      case "cpp":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-c++src");
        plang = "C++";
        instance.refresh();
        break;
      case "cs":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-csharp");
        plang = "C#";
        instance.refresh();
        break;
      case "java":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-java");
        plang = "Java";
        instance.refresh();
        break;
      case "h":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-objectivec");
        plang = "Objective-C";
        instance.refresh();
        break;
      case "kt":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "text/x-kotlin");
        plang = "Kotlin";
        instance.refresh();
        break;
      case "ts":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "application/typescript");
        plang = "TypeScript";
        instance.refresh();
        break;
      case "toml":
      case "rs":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "rust");
        plang = "Rust";
        instance.refresh();
        break;
      default:
        instance.refresh();
    }
  }
}

const registerNewProject = function(dir) {
  // Add a new directory to the history if it is the first time it has been opened in the editor
  fs.readFile(logDir, "utf8", function(err, data) {
    if (err) return;
    log = JSON.parse(data);
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
  });
};

const HTML_template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>New Project</title>
    <meta name="description" content="Graviton Project">
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
`;
const g_newProject = function(template) {
  dialog.showOpenDialog({ properties: ["openDirectory"] }, selectedFiles => {
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
            HTML_template,
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
const g_NewProjects = () => {
  const new_projects_window = new Window({
    id: "new_projects_window",
    content: `
      <h2 class="window_title">${current_config.language["Templates"]}</h2> 
      <div onclick="g_newProject('html'); closeWindow('new_projects_window');" class="section-2">
        <p>HTML</p>
      </div>`
  });
  new_projects_window.launch();
};
const preload = array => {
  // Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
    <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`;
    document.getElementById(array[i]).remove();
  }
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

function look(text){
  let _variables =[];
  for(i=0;i<text.length;i++){
    switch(editor.getMode().name){
      case "javascript":
        switch (text[i]){
          case "let":
          case "var":
          case "const":
            _variables.push({
              _name: text[i+1]
            });
          break;        
        }
      break;
      case "java":
        switch (text[i]){
          case "int":
          case "char":
          case "float":
            _variables.push({
              _name: text[i+1]
            });
          break;        
        }
      break;
    }
  }
  return _variables;
}

class elasticContainerComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const container = this;
    container.id = "elastic"+Math.random()
    const related = (function(){
      if(container.getAttribute("related")=="parent" || container.getAttribute("related") == undefined ){
        return container.parentElement;
      }
      if(container.getAttribute("related")=="child"){
        return  container.children[0];
      }
      if(container.getAttribute("related")=="self"){
        return  container;
      }
    })()
    const el = this.parentElement;
    el.onscroll = function() {
      if(Number(el.getAttribute("toleft"))!=el.scrollLeft) return;
      el.setAttribute("toleft",el.scrollLeft)
      if(current_config.bouncePreferences == "desactivated") return;
      if( related == null) {
        return;
      }
      if(related.id!=undefined){
        if(document.getElementById(related.id)==undefined){
          return;
        }
      }  
      if (el.scrollTop == 0) {
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_top")
        this.insertBefore(spacer, this.children[0])
        setTimeout(function() {
          spacer.remove()
        }, 360)      
      }
      if (el.scrollHeight-2 <= el.scrollTop+el.clientHeight) {
        if(document.getElementsByClassName("bounce_bottom").length!=0 || related == null) return;
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_bottom")
        this.appendChild(spacer)
        setTimeout(function() {
          spacer.remove()
        }, 360)      
      }
    } 
  }
}
window.customElements.define("elastic-container", elasticContainerComponent);

const elasticContainer ={
  append: function(el){
    el.onscroll = function() {
      if(Number(el.getAttribute("toleft"))!=el.scrollLeft) return;
      el.setAttribute("toleft",el.scrollLeft)
      if(current_config.bouncePreferences == "desactivated") return;
      if (el.scrollTop >= 0 && el.scrollTop < 10) {
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_top")
        this.insertBefore(spacer, this.children[0])
        setTimeout(function() {
          spacer.remove()
        }, 360)      
      }
      if (el.scrollHeight-2 <= el.scrollTop+el.clientHeight) {
        if(document.getElementsByClassName("bounce_bottom").length!=0) return;
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_bottom")
        this.appendChild(spacer)
        setTimeout(function() {
          spacer.remove()
        }, 360)      
      }
    } 
  }
}

