/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_version = {
  date: "190609",
  version: "1.0.1",
  state: "Beta"
}
let new_update = false;
const os = require('os');
const close_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="11.821" height="11.82" viewBox="0 0 11.821 11.82">
  <g id="close" transform="translate(-4.786 -4.868)">
    <path id="Trazado_1" data-name="Trazado 1" d="M.7,1.5l12.336-.081a.467.467,0,0,1,.472.472.482.482,0,0,1-.478.478L.69,2.452a.467.467,0,0,1-.472-.472A.482.482,0,0,1,.7,1.5Z" transform="translate(16.917 7.296) rotate(135)" stroke-linecap="square" stroke-width="1.2"/>
    <path id="Trazado_2" data-name="Trazado 2" d="M.428-.043,12.764.038a.482.482,0,0,1,.478.478.467.467,0,0,1-.472.472L.434.906A.482.482,0,0,1-.043.428.467.467,0,0,1,.428-.043Z" transform="translate(15.029 15.778) rotate(-135)" stroke-linecap="square" stroke-width="1.2"/>
  </g>
</svg>`;
const { shell } = require("electron");
const fs = require("fs-extra");
const path = require("path");
const { dialog } = require("electron").remote;
const remote = require("electron").remote;
const BrowserWindow = require("electron").BrowserWindow;
const app = require('electron').remote
const getAppDataPath = require("appdata-path");
const $ = require('jquery');
const { webFrame } = require('electron');
const g_window = require('electron').remote.getCurrentWindow();
const { systemPreferences } = require('electron').remote;
const url = require("url");
let current_screen;
let dir_path;
let i;
let DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton");
let tabs = [];
let FirstFolder = "not_selected";
let editingTab;
let ids = 0;
let plang = " ";
let _notifications = [];
let filepath = " ";
let editors = [];
let editor;
let editorID;
let editor_mode = "normal";
let g_highlighting = "activated";
let _previewer;
let _enable_preview = false;
let log = [];
let themes = [];
let themeObject;
const dictionary = autocomplete.javascript; //Import javascript dictionary
if (path.basename(__dirname) !== "Graviton-Editor") DataFolderDir = path.join(getAppDataPath(), ".graviton");
if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir); //Create .graviton if it doesn't exist
/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json");
let configDir = path.join(DataFolderDir, "config.json");
let timeSpentDir = path.join(DataFolderDir, "_time_spent.json");
let themes_folder = path.join(DataFolderDir, "themes");
let highlights_folder = path.join(DataFolderDir, "highlights");
let plugins_folder = path.join(DataFolderDir, "plugins");
let plugins_db = path.join(DataFolderDir, "plugins_db");
let mouseClicked = false;
let touchingResizerValue = false;
let editor_screens = [];
document.addEventListener('mousedown', function(event) { 
    if ( event.which ) mouseClicked = true;
}, true);

document.addEventListener('mouseup', function(event) { 
    if ( event.which ) mouseClicked = false;
}, true);
document.addEventListener('mousemove', function(event) { 
    if(mouseClicked && touchingResizerValue){
      const explorer = document.getElementById("g_explorer");
      explorer.style = `width: ${event.clientX-3}px`;
    }
}, true);
const loadEditor = (info) => {
    if ( document.getElementById(info.dir + "_editor") == undefined) {
      switch (info.type) {
        case "text":
          let text_container = document.createElement("div");
          text_container.classList = "code-space";
          text_container.setAttribute("id", info.dir + "_editor");
          document.getElementById(current_screen.id).children[2].appendChild(text_container);
          let codemirror = CodeMirror(document.getElementById(info.dir + "_editor"), {
            value: info.data,
            mode: "text/plain",
            htmlMode: false,
            theme: themeObject["Highlight"],
            lineNumbers: true,
            autoCloseTags: true,
            indentUnit: 2,
            id:info.dir,
            styleActiveLine: true,
            lineWrapping: current_config["lineWrappingPreferences"] == "activated"
          });
          document.getElementById(current_screen.id).children[3].children[0].innerText = getLanguageName(getFormat(path.basename(info.dir)));
          const new_editor_text = {
            id: info.dir + "_editor",
            editor: codemirror,
            path: info.dir,
            screen: info.screen
          };
          editors.push(new_editor_text);
          if (g_highlighting == "activated") updateCodeMode(codemirror,info.dir);
          for (i = 0; i < editors.length; i++) {
            if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editorID = new_editor_text.id;
          editor = new_editor_text.editor;
          document.getElementById(info.dir + "_editor").style.display = "block";
          codemirror.on("focus",function(a){
            for(i=0;i<editors.length;i++){
              if(editors[i].id==a.options.id+"_editor"){
                editor = editors[i].editor;
                editorID = editors[i].id
                for (let b = 0; b < tabs.length; b++) {
                  if (tabs[b].getAttribute("screen") == editors[i].screen && tabs[b].classList.contains("selected")) {
                    editingTab = tabs[b].id;
                    filepath = tabs[b].getAttribute("longpath");
                  }
                } 
              }
            }
          })
          break;
        case "image": 
          const image_container = document.createElement("div");
          image_container.classList = "code-space";
          image_container.setAttribute("id", `${info.dir}_editor`);
          image_container.innerHTML = `<img src="${info.dir}">`
          console.log(info);
          document.getElementById(current_screen.id).children[2].appendChild(image_container);
          const new_editor_image = {
            id: info.dir + "_editor",
            editor: undefined,
            path: info.dir,
            screen: info.screen
          };
          for (i = 0; i < editors.length; i++) {
            if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editors.push(new_editor_image);
          document.getElementById(info.dir + "_editor").style.display = "block";
          editorID = new_editor_image.id;
          document.getElementById(current_screen.id).children[3].children[0].innerText = "Image"
        break;
        case "free":
          const free_id= Math.random();
          const free_container = document.createElement("div");
          free_container.classList = "code-space";
          free_container.setAttribute("id", `${info.dir}_editor`);
          free_container.innerHTML = info.data;
          document.getElementById(current_screen.id).children[2].appendChild(free_container);
          const new_editor_free = {
            id: info.dir + "_editor",
            editor: undefined,
            path:undefined,
            screen: info.screen,
            type:"free"
          };
          for (i = 0; i < editors.length; i++) {
            if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editors.push(new_editor_free);
          document.getElementById( info.dir + "_editor").style.display = "block";
          editorID = new_editor_free.id;
          document.getElementById(current_screen.id).children[3].children[0].innerText = " "
        break;
      }
    } else { //Editor exists
      for (i = 0; i < editors.length; i++) {
        if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
          document.getElementById(editors[i].id).style.display = "none";
        }
        if (editors[i].id == info.dir + "_editor") {
          if (editors[i].editor != undefined) { //Editors
            editor = editors[i].editor;
            
            document.getElementById(current_screen.id).children[3].children[0].innerText = getLanguageName(getFormat(path.basename(editors[i].path)));
          } else if(info.type!="free"){ //Images
            document.getElementById(current_screen.id).children[3].children[0].innerText = "Image"
          } else{
            document.getElementById(current_screen.id).children[3].children[0].innerText = ""
          }
          editorID = editors[i].id;
          document.getElementById(editorID).style.display = "block";
          if(editor!=undefined) editor.refresh();
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
        close_icon.children[1].innerHTML = ` <svg class="ellipse" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
        <circle id="Elipse_1" data-name="Elipse 1" cx="5" cy="5" r="5"/></svg> `;
        document.getElementById(editingTab).setAttribute("data", editor.getValue());
        if (current_config["autoCompletionPreferences"] == "activated" && plang == "JavaScript") {
          //Getting Cursor Position
          const cursorPos = editor.cursorCoords();
          //Getting Last Word
          const A1 = editor.getCursor().line;
          const A2 = editor.getCursor().ch;
          const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
          const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
          const lastWord = editor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 });
          //Context Menu
          filterIt(dictionary, lastWord, function(filterResult) {
            if (filterResult.length > 0 && lastWord.length >= 3) {
              let contextOptions;
              for (var i = 0; i < filterResult.length; i++) {
                contextOptions += "<button class='option'>" + filterResult[i]._name + "</button>"
                contextOptions = contextOptions.replace("undefined", "");
                $("context .menuWrapper").html(contextOptions);
              }
              $("context").fadeIn();
              $("context").css({ "top": (cursorPos.top + 30) + "px", "left": cursorPos.left + "px" });
              $("context .menuWrapper .option").first().addClass("hover");
            }else if (filterResult.length === 0 || lastWord.length < 3) {
              $("context").fadeOut();
              $("context .menuWrapper").html("");
            }
          });
        }
      });
      editor.on("keydown", function(editor, e) {
        if ($("context").css("display") != "none") {
          //Ignore keys actions on context options displayed.
          editor.setOption("extraKeys", {
            "Up": function() {
              if (true) {
                return CodeMirror.PASS;
              }
            },
            "Down": function() {
              if (true) {
                return CodeMirror.PASS;
              }
            },
            "Enter": function() {
              if (true) {
                return CodeMirror.PASS;
              }
            }
          });
        } else { //Reset keys actions.
          editor.setOption("extraKeys", {
            "Up": "goLineUp"
          });
        }
        //Context Options keys handler
        $("context .menuWrapper .option.hover").filter(function() {
          if (e.keyCode === 40 && !$("context .menuWrapper .option").last().hasClass("hover") && $("context").css("display") != "none") {
            $("context .menuWrapper .option").removeClass("hover")
            $(this).next().addClass("hover");
            document.getElementById("context").scrollBy(0, 30);
            return false;
          } else if (e.keyCode === 38 && !$("context .menuWrapper .option").first().hasClass("hover") && $("context").css("display") != "none") {
            $("context .menuWrapper .option").removeClass("hover")
            $(this).prev().addClass("hover");
            document.getElementById("context").scrollBy(0, -30);
            return false;
          }
          //Selection key Triggers
          if (e.keyCode === 13) {
            const A1 = editor.getCursor().line;
            const A2 = editor.getCursor().ch;
            const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
            const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
            const selected = $(this).text();
            editor.replaceRange(selected, { line: A1, ch: B1 }, { line: A1, ch: B2 });
            setTimeout(function() {
              $("context").fadeOut();
              $("context .menuWrapper").html("");
            }, 100)
          }
        });
      });
      $("context .menuWrapper").on("mouseenter", "div.option", function() {
        $("context .menuWrapper .option").not(this).removeClass("hover");
        $(this).addClass("hover");
      });
      $("context .menuWrapper").on("mousedown", "div.option", function(e) {
        const A1 = editor.getCursor().line;
        const A2 = editor.getCursor().ch;
        const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
        const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch;
        const selected = $(this).text();
        editor.replaceRange(selected, { line: A1, ch: B1 }, { line: A1, ch: B2 });
        $("context").fadeOut();
        $("context .menuWrapper").html("");
        e.preventDefault();
      })
      editor.addKeyMap({"Ctrl-S": function(cm){saveFile()}});

      editor.setOption("extraKeys", { /*TEST*/
        Ctrl: function(editor) {},
      });
      editor.on("change", function() { //Preview detector
        setTimeout(function() {
          if (graviton.getCurrentFile() != undefined && _enable_preview === true) {
            saveFile();
            _previewer.reload();
          }
        }, 550);
      });
    }  
}
function restartApp() {
  remote.app.relaunch();
  remote.app.exit(0);
}
Mousetrap.bind("ctrl+s", function() {
  saveFile();
});
function save_file_warn(ele) {
  new g_dialog({
    id: "saving_file_warn",
    title: current_config.language['Warn'],
    content: current_config.language["FileExit-dialog-message"],
    buttons: {
      [current_config.language['FileExit-dialog-button-accept']]: `closeDialog(this); ${ele.getAttribute('onclose')}`,
      [current_config.language['Cancel']]: `closeDialog(this);`,
      [current_config.language['FileExit-dialog-button-deny']]: 'saveFile(); closeDialog(this);',
    }
  })
}

function saveFileAs() {
  dialog.showSaveDialog(fileName => {
    fs.writeFile(fileName, editor.getValue(), err => {
      if (err) {
        alert(`An error ocurred creating the file ${err.message}`);
        return;
      }
      filepath = fileName;
      new Notification("Graviton", `The file has been succesfully saved in ${fileName}`);
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
      id: Math.random()+ fileNames[0].replace(/\\/g, "\\\\") + "B",
      path:fileNames[0],
      name:fileNames[0],
      type:"file"
    })
  });
}

function openFolder() {
  dialog.showOpenDialog({ properties: ["openDirectory"] },
    selectedFiles => {
      if (selectedFiles === undefined) return;
      loadDirs(selectedFiles[0], "g_directories", true)
    }
  );
}

function saveFile() {
  fs.writeFile(filepath, editor.getValue(), err => {
    if (err) return err;
    document.getElementById(editingTab).setAttribute("file_status", "saved");
    document
      .getElementById(editingTab)
      .children[1].setAttribute("onclick", document.getElementById(editingTab).children[1].getAttribute("onclose"));
    document.getElementById(editingTab).children[1].innerHTML = close_icon;
  });
}

function loadDirs(dir, app_id, first_time) {
  if(!fs.existsSync(dir)){
    graviton.throwError(current_config.language["DirectoryDoesntExist"])
  }
  const appender_id = app_id.replace(/\\/g, "");
  if (appender_id == "g_directories"){
    document.getElementById("g_explorer").innerHTML = `<div id="g_directories"></div>`
    dir_path = dir;
  } 
  let working_folder;
  FirstFolder = dir;
  const appender = document.getElementById(appender_id);
  if (appender.getAttribute("opened") == "true") {
    appender.setAttribute("opened", "false");
    const dir_length = appender.children.length;
    appender.children[0].children[0].setAttribute("src", g_getCustomFolder(path.basename(FirstFolder), "close"));
    appender.children[1].innerHTML = "";
    return;
  } else {
    document.getElementById(appender_id).setAttribute("opened", "true");
    if (first_time === false) {
      const click = document.getElementById(appender_id).children[0];
      click.children[0].setAttribute("src", g_getCustomFolder(path.basename(FirstFolder), "open"));
    }
  }
  if (first_time) {
    if (document.getElementById("openFolder") != null) document.getElementById("openFolder").remove();
    registerNewProject(dir);
    working_folder = document.createElement("div");
    for (i = 0; i < document.getElementById(appender_id).children.length; i++) {
      document.getElementById(appender_id).children[i].remove();
    }
    document.getElementById(appender_id).setAttribute("opened", "false");
    working_folder.setAttribute("id", "g_directory");
    working_folder.setAttribute("myPadding", "50");
    working_folder.innerHTML = `<p>${path.basename(dir)}</p>` ;
    document.getElementById(appender_id).appendChild(working_folder);
  } else {
    working_folder = document.getElementById(appender_id).children[1];
  }
  const paddingListDir = Number(document.getElementById(appender_id).getAttribute("myPadding")) + 7; //Add padding
  fs.readdir(dir, (err, paths) => {
    ids = 0;
    if (paths == undefined) {
      graviton.throwError("Cannot read files on the directory :" + FirstFolder + ". Check the permissions.")
      return;
    }
    for (i = 0; i < paths.length; i++) {
      let _long_path = path.join(dir, paths[i]);
      if (graviton.currentOS() == "win32") {
        _long_path = _long_path.replace(/\\/g, "\\\\");
      }
      ids++;
      const stats = fs.statSync(_long_path);
      if (stats.isDirectory()) {
        //If is folder
        const directory_temp = document.createElement("div");
        directory_temp.innerHTML+=`
        <div opened="false" ID="${ids+dir.replace(/\\/g, "")}" name="${paths[i]}" style="padding-left:${paddingListDir}px; vertical-align:middle;">
          <div style=" width:${Number(paths[i].length * 6 + 55)}px;" class="directory" onclick="loadDirs('${_long_path}','${ids+dir.replace(/\\/g, "")}',false)">
            <img style="float:left; padding-right:3px;" src="${g_getCustomFolder(paths[i], "close")}">
            ${paths[i]}
          </div>
          <div myPadding="${paddingListDir}" longpath="${_long_path}"></div>
        </div>`
        working_folder.appendChild(directory_temp);
      }
    }
    for (i = 0; i < paths.length; i++) {
      let _long_path = path.join(dir, paths[i]);
      if (graviton.currentOS() == "win32") {
        _long_path = _long_path.replace(/\\/g, "\\\\"); //Delete
      }
      ids++;
      const stats = fs.statSync(_long_path);
      if (stats.isFile()) {
        const file_temp = document.createElement("div");
        file_temp.innerHTML+=`
        <div onclick="new Tab({
          id:'${ids+ dir.replace(/\\/g, "") + "B"}',
          path:'${_long_path}',
          name:'${paths[i]}',
          type:'file'
        })" myPadding="${paddingListDir}" longPath="${_long_path}" class="file" ID="${ids+ dir + "B"}" name="${paths[i]}" style="width:${paths[i].length * 6 + 55}px; margin-left:${paddingListDir}px; vertical-align:middle;">
          <img style="float:left; padding-right:3px;" src="src/icons/files/${getFormat(paths[i])}.svg">
          <p>
          ${paths[i]}
          </p>
        </div>`
        working_folder.appendChild(file_temp);
      }
    }
  });
}

function g_getCustomFolder(path, state) {
  switch (path) {
    case "node_modules":
      return "src/icons/custom_icons/node_modules.svg"
      break;
    case ".git":
      return "src/icons/custom_icons/git.svg"
      break;
    default:
      if (state == "close") {
        return "src/icons/closed.svg";
      } else {
        return "src/icons/open.svg";
      }
  }
}

function getFormat(text) {
  switch (text.split(".").pop()) {
    case "html":
      return "html";
      break;
    case "js":
      return "js";
      break;
    case "css":
      return "css";
      break;
    case "json":
      return "json";
      break;
    case "go":
      return "go";
      break;
    case "sql":
      return "sql";
      break;
    case "ruby":
      return "ruby";
      break;
    case "php":
      return "php";
      break;
    case "sass":
      return "sass";
      break;
    case "dart":
      return "dart";
      break;
    case "pascal":
      return "pascal";
      break;
    case "md":
      return "unknown";
      break;
    case "jpg":
    case "png":
    case "ico":
    case "svg":
      return "image";
    break;
    default:
      return "unknown";
  }
}
function getLanguageName(format){
switch (format) {
      case "html":
        return "HTML";
        break;
      case "css":
        return "CSS";
        break;
      case "js":
        return "JavaScript";
        break;
      case "json":
        return "JSON ";
        break;
      case "go":
        return "Go";
        break;
      case "sql":
        return "SQL";
        break;
      case "ruby":
        return "Ruby";
        break;
      case "php":
        return "PHP";
        break;
      case "sass":
        return "Sass";
        break;
      case "dart":
        return "Dart";
        break;
      case "pascal":
        return "Pascal";
        break;
      case "md":
        return "Markdown";
        break;
      case "py":
        return "Python";
        break;
      default:
    }
}
function updateCodeMode(instance,path) {
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
      case "json":
        instance.setOption("htmlMode", false);
        instance.setOption("mode", "javascript");
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
        instance.setOption("htmlMode", false);
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
      default:
    }

  }
}
const registerNewProject = function(dir) { //Add a new directory to the history if it is the first time it has been opened in the editor
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
}
const g_ZenMode =()=>{
  if (editor_mode == "zen") {
    editor_mode = "normal";
    document.getElementById("g_explorer").style = "visibility: visible; width:210px; display:block;";
    document.getElementById("g_spacer").style = " display:block;";
  } else {
    editor_mode = "zen";
    document.getElementById("g_explorer").style = "visibility: hidden; width:0px; display:none;";
    document.getElementById("g_spacer").style = " width:0; display:none;";
  }
}
const g_preview = function() {
  if (_enable_preview === false) {
    if (getFormat(graviton.getCurrentFile().path) != "html") return;
    _enable_preview = true;
    _previewer = new BrowserWindow({
      width: 800,
      height: 600
    });
    _previewer.loadURL(
      url.format({
        pathname: graviton.getCurrentFile().path,
        protocol: "file:",
        slashes: true
      })
    );
    _previewer.on("closed", () => {
      _enable_preview = false;
    });
    _previewer.setTitle("Previewer");
  } else {
    _enable_preview = false;
    _previewer.close();
  }
}
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
  dialog.showOpenDialog({ properties: ["openDirectory"] },
    selectedFiles => {
      if (selectedFiles !== undefined) {
        switch (template) {
          case "html":
            const g_project_dir = path.join(selectedFiles[0], ".GravitonProject " + Date.now());
            fs.mkdirSync(g_project_dir);
            fs.writeFile(path.join(g_project_dir, "index.html"), HTML_template, err => {
              if (err) {
                return err;
              }
              loadDirs(g_project_dir, "g_directories", true)
            });
          break;
        }
      }
    }
  );
}
const g_NewProjects = () => {
  const new_projects_window = new Window({
    id:"new_projects_window",
    content:`
      <h2 class="window_title">${current_config.language["Templates"]}</h2> 
      <div onclick="g_newProject('html'); closeWindow('new_projects_window');" class="section_hover">
        <p>HTML</p>
      </div>`
  })
  new_projects_window.launch()
}
const preload = (array) => { //Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
    <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`
    document.getElementById(array[i]).remove();
  }
}
const touchingResizer = type=>{
  if(type==false){
    if(!mouseClicked){
      touchingResizerValue = false;
    }
  }else{
      touchingResizerValue = true;
  }
}
const screens={
  add : function(){
    const current_id = Math.random()+Math.random();
    const new_screen_editor = document.createElement("div");
    new_screen_editor.classList = "g_editors"
    new_screen_editor.id = current_id;
    new_screen_editor.innerHTML=`
       <div class="g_tabs_bar flex smallScrollBar"></div>  
        <p class="translate_word temp_dir_message" idT="WelcomeMessage" >${current_config.language["WelcomeMessage"]}</p>
        <div class="g_editors_editors" >
        </div>
        <div class="g_status_bar" >
          <p ></p>
          <div><div>
        </div>
    `
    document.getElementById("g_content").insertBefore(new_screen_editor, document.getElementById("g_content").children[document.getElementById("g_content").children.length-1])
    editor_screens.push({
      id:current_id
    })
    current_screen = editor_screens[editor_screens.length-1]
    new_screen_editor.addEventListener('click', function(event) { 
      current_screen.id = this.id
    }, true);
  },
  remove: function(given_number){
    const number = given_number-1; //example 1 to 0, (feels more natural for the user,js arrays start at 0)
    if(editor_screens.length!=1){
      for(i=0;i<editor_screens.length;i++){
        if(i==number){
          let tabs2 =[];
          for(b=0;b<tabs.length;b++){
            if(tabs[b].getAttribute("screen")==editor_screens[number].id){
              tabs2.push(tabs[b]);
            }
          }
          if(tabs2.length==0){
            document.getElementById(editor_screens[number].id).remove();
            editor_screens.splice(number,1)
            console.log(number);
            editors.splice(number , 1); 
            current_screen = editor_screens[editor_screens.length-1];
          }else{
            graviton.throwError(current_config.language["Notification.CloseAllTabsBefore"]);
          }
          return;
        }
      }
    }else{
      graviton.throwError(current_config.language["Notification.CannotRemoveMoreScreens"])
    }
  },
  default: function(){
    for(i=0;i<editor_screens.length;i++){
      if(i!=0){
        let tabs2 =[];
        const number = i;
        for(b=0;b<tabs.length;b++){
          if(tabs[b].getAttribute("screen")==editor_screens[number].id){
            tabs2.push(tabs[b]);
          }
        }
        if(tabs2.length==0){
          document.getElementById(editor_screens[number].id).remove();
          editor_screens.splice(number,1)
          editors.splice(number , 1);
           current_screen = editor_screens[editor_screens.length-1];
          i--;
        }else{
          graviton.throwError(current_config.language["Notification.CloseAllTabsBefore"]);
        }
      }
    }
  }
}