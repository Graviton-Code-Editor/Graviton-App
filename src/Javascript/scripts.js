const dateVersion = 190323; //The release date
const version = "0.7.2"; //Tagged num
const close_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate; " viewBox="0 0 24 24" width="24" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)"  vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg>`;
/* Importing some required modules */
const { shell } = require("electron");

const fs = require("fs-extra");
const path = require("path");
const { dialog } = require("electron").remote;
const mkdirp = require("mkdirp");
const remote = require("electron").remote;
const BrowserWindow = require("electron").BrowserWindow;
const app = require("electron").remote.getCurrentWindow();
const $ = require('jquery');
var i;
var DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton");
var tabs = [];
var tabsEqualToFiles = [];
var FirstFolder = "not_selected";
var editingTab;
var ids = 0;
let plang = " ";
var editorIsReady = false;
var _notifications = [];
var filepath = "start";
var editors = [];
var editor;
var editorID;
var editor_mode = "normal";
var _previewer;
var _enable_preview = false;
const dictionary = autocomplete.javascript;
if (path.basename(__dirname) !== "Graviton-Editor") {
    DataFolderDir = path.join(
      path.join(__dirname, "..", "..", ".."),
      ".graviton"
    );
}
if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir); //Create .graviton if it doesn't exist
/* Set path for graviton's files and dirs */
var logDir = path.join(DataFolderDir, "log.json"); 
var configDir = path.join(DataFolderDir, "config.json");
var timeSpentDir = path.join(DataFolderDir, "_time_spent.json");
var themes_folder = path.join(DataFolderDir, "themes");
var highlights_folder = path.join(DataFolderDir, "highlights");
var plugins_folder = path.join(DataFolderDir, "plugins");
var plugins_db = path.join(DataFolderDir, "plugins_db");
function loadEditor(path, data) {
  if (document.getElementById(path + "_editor") == undefined) {
    //Editor doesn't exist
    const element = document.createElement("div");
    element.classList = "code-space";
    element.setAttribute("id", path + "_editor");
    document.getElementById("body-space").appendChild(element);
    const codemirror = CodeMirror(document.getElementById(path + "_editor"), {
      value: data,
      mode: "javascript",
      htmlMode: false,
      theme: "default",
      lineNumbers: true,
      autoCloseTags: true
    });
    const new_editor = {
      id: path + "_editor",
      editor: codemirror
    };
    editors.push(new_editor);
    if (document.getElementById(editorID) != undefined)
      document.getElementById(editorID).style.display = "none";
    editorID = new_editor.id;
    editor = new_editor.editor;
    document.getElementById(path + "_editor").style.display = "block";
  } else {
    //Editor exists
    for (i = 0; i < editors.length; i++) {
      document.getElementById(editors[i].id).style.display = "none";
      if (editors[i].id == path + "_editor") {
        editor = editors[i].editor;
        //editor.setValue(data);
        editorID = editors[i].id;
        document.getElementById(editorID).style.display = "block";
      }
    }
  }
function filterIt(arr, searchKey, cb) {
  var list = [];
  for (var i=0;i < arr.length; i++) {
    var curr = arr[i];
    Object.keys(curr).some(function(key){
      if (typeof curr[key] === "string" && curr[key].includes(searchKey)) {
        list.push(curr);
      }
    });
  }
  return cb(list);
}

editor.on("change", function() {
    //Save data when switching between tabs
    if(editors.length!=1){ //Prevent from saving the start message
      document
        .getElementById(editingTab)
        .setAttribute("file_status", "unsaved");
      document
        .getElementById(editingTab)
        .children[1].setAttribute("onclick", "saveFile()");
      document.getElementById(
        editingTab
      ).children[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><ellipse vector-effect="non-scaling-stroke" cx="11.9999975" cy="11.9996439465" rx="6.303149298000001" ry="6.3035028515" fill="var(--accentColor)"/></svg>`;
      document
        .getElementById(editingTab)
        .setAttribute("data", editor.getValue());
    }
  //Getting Cursor Position
  const cursorPos = editor.cursorCoords();
  //Getting Last Word
  const A1 = editor.getCursor().line;
  const A2 = editor.getCursor().ch;

  const B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
  const B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

  const lastWord = editor.getRange({line: A1,ch: B1}, {line: A1,ch: B2});

  //Context Menu

  filterIt(dictionary, lastWord, function(filterResult){
    if (filterResult.length > 0 && lastWord.length >= 3) {
      let contextOptions;
      for (var i=0; i< filterResult.length; i++) {
        contextOptions +="<button class='option'>"+filterResult[i]._name+"</button>"
        contextOptions = contextOptions.replace("undefined","");
        $("context .menuWrapper").html(contextOptions);
      }
      $("context").fadeIn();
      $("context").css({"top":(cursorPos.top + 30)+"px", "left":cursorPos.left+"px"});
      $("context .menuWrapper .option").first().addClass("hover");
    }else if (filterResult.length === 0 || lastWord.length < 3){
      $("context").fadeOut();
      $("context .menuWrapper").html("");
    }
  });
  });
editor.on("keydown", function(editor, e){
  if ($("context").css("display") != "none") {

    //Ignore keys actions on context options displayed.

    editor.setOption("extraKeys", {
      "Up": function(){
        if(true) {
          return CodeMirror.PASS;
        }
      },
      "Enter": function(){
        if(true) {
          return CodeMirror.PASS;
        }
      }
    });
  }else{

    //Reset keys actions.

    editor.setOption("extraKeys", {
      "Up": "goLineUp"
    });
  }

  //Context Options keys handler

  $("context .menuWrapper .option.hover").filter(function(){
    if (e.keyCode === 40 && !$("context .menuWrapper .option").last().hasClass("hover") && $("context").css("display") != "none") {
      $("context .menuWrapper .option").removeClass("hover")
      $(this).next().addClass("hover");
      return false;
    } else if (e.keyCode === 38 && !$("context .menuWrapper .option").first().hasClass("hover") && $("context").css("display") != "none") {
      $("context .menuWrapper .option").removeClass("hover")
      $(this).prev().addClass("hover");
      return false;
    }
    //Selection key Triggers
    if (e.keyCode === 13) {
      const A1 = editor.getCursor().line;
      const A2 = editor.getCursor().ch;

      const B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
      const B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

      const selected = $(this).text();
      editor.replaceRange(selected, {line: A1,ch: B1}, {line: A1,ch: B2});
      setTimeout(function() {
        $("context").fadeOut();
        $("context .menuWrapper").html("");
      },100)
    }
  });
});


$("context .menuWrapper").on("mouseenter", "div.option", function(){
  $("context .menuWrapper .option").not(this).removeClass("hover");
  $(this).addClass("hover");
});

$("context .menuWrapper").on("mousedown", "div.option", function(e) {
  const A1 = editor.getCursor().line;
  const A2 = editor.getCursor().ch;

  const B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
  const B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

  const selected = $(this).text();
  editor.replaceRange(selected, {line: A1,ch: B1}, {line: A1,ch: B2});
  $("context").fadeOut();
  $("context .menuWrapper").html("");
  e.preventDefault();
})
editor.on("change", function() {    //Preview detector
      setTimeout(function() {
        if (graviton.getCurrentFile() != undefined && _enable_preview === true) {
          saveFile();
          _previewer.reload();
        }
      }, 550);
  });
}

loadEditor("start", "/*This is Graviton Code Editor!*/"); //Create the first editor

function restartApp() {
  remote.app.relaunch();
  remote.app.exit(0);
}

Mousetrap.bind("ctrl+s", function() {
  saveFile();
});

editor.setOption("extraKeys", { /*TEST*/
  Ctrl: function(editor) {  
  },
});
function saveFileAs() {
  var content = document.getElementById("code-space").textContent;
  dialog.showSaveDialog(fileName => {
    fs.writeFile(fileName, content, err => {
      if (err) {
        alert(`An error ocurred creating the file ${err.message}`);
      }
      filepath = fileName;
      alert(`The file has been succesfully saved in ${fileName}`);
    });
  });
}
function openFile() {
  dialog.showOpenDialog(fileNames => {
    // fileNames is an array that contains all the selected files
    if (fileNames === undefined) {
      return;
    }
    fs.readFile(fileNames[0], "utf8", function(err, data) {
      if (err) {
        return err;
      }
      editor.setValue(data); //Updating data in the editor
    });
  });
}
function openFolder() {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory"]
    },
    selectedFiles => loadDirs(selectedFiles[0], "left-bar", true)
  );
}
function saveFile() {
  if(editors.length!=1){ //Prevent from saving the start message
    fs.writeFile(filepath, editor.getValue(), err => {
      if (err) {
        return err;
      }
      document.getElementById(editingTab).setAttribute("file_status", "saved");
      document
        .getElementById(editingTab)
        .children[1].setAttribute("onclick", "deleteTab('" + editingTab + "')");
      document.getElementById(editingTab).children[1].innerHTML = close_icon;
    });
  }
}
function loadDirs(dir, appendID, __FirstTime) {
  let _SUBFOLDER;
  FirstFolder = dir;
  const me = document.getElementById(appendID);
  if (me.getAttribute("opened") == "true") {
    me.setAttribute("opened", "false");
    const dir_length = me.children.length;
    for (i = 0; i < dir_length; i++) {
      if (i == 0) {
        me.children[0].children[0].setAttribute("src", "src/icons/closed.svg");
      } else {
        me.children[1].remove();
      }
    }
    return;
  } else {
    document.getElementById(appendID).setAttribute("opened", "true");
    if (__FirstTime === false) {
      var click = document.getElementById(appendID).children[0];
      click.children[0].setAttribute("src", "src/icons/open.svg");
    }
  }
  if (__FirstTime ) {
    registerNewProject(dir); //
     _SUBFOLDER = document.createElement("div");
    for (i = 0; i < document.getElementById(appendID).children.length; i++) {
      document.getElementById(appendID).children[i].remove();
    }
    document.getElementById(appendID).setAttribute("opened", "false");
    _SUBFOLDER.setAttribute("class", "folder");
    _SUBFOLDER.setAttribute("myPadding", "50");
    _SUBFOLDER.setAttribute("style", "margin:10px 20px; font-size:17px; ");
    ids = 0;
    _SUBFOLDER.innerText = path.basename(dir);
    document.getElementById(appendID).appendChild(_SUBFOLDER);
  } else {
     _SUBFOLDER = document.getElementById(appendID);
  }
  const paddingListDir = Number(document.getElementById(appendID).getAttribute("myPadding")) + 5; //Add padding
  fs.readdir(dir, (err, paths) => {
    for (i = 0; i < paths.length; i++) {
      let _LONGPATH = path.join(dir, paths[i]);
      if (graviton.currentOS() == "win32") {
        _LONGPATH = _LONGPATH.replace(/\\/g, "\\\\");
      }
      ids++;
      const stats = fs.statSync(_LONGPATH);
      if (stats.isDirectory()) {
        //If is folder
        const element = document.createElement("div");
        element.setAttribute("opened", "false");
        element.setAttribute("ID", ids);
        element.setAttribute("name", paths[i]);
        element.setAttribute(
          "style",
          "padding-left:" + paddingListDir + "px; vertical-align: middle;"
        );
        element.setAttribute("myPadding", paddingListDir);
        element.setAttribute("longPath", _LONGPATH);
        const touch = document.createElement("div");
        touch.setAttribute(
          "onClick",
          "loadDirs('" + _LONGPATH + "','" + ids + "',false)"
        );
        touch.innerText = paths[i];
        touch.setAttribute("class", " folder_list2  ");
        touch.setAttribute(
          "style",
          " width: " + Number(paths[i].length * 6 + 35) + "px;"
        );
        const image = document.createElement("img");
        image.setAttribute("src", "src/icons/closed.svg");
        image.setAttribute("style", "float:left; margin-right:3px;");
        element.appendChild(touch);
        touch.appendChild(image);
        _SUBFOLDER.appendChild(element);
      }
    }
    for (i = 0; i < paths.length; i++) {
      let _LONGPATH = path.join(dir, paths[i]);
      if (graviton.currentOS() == "win32") {
        _LONGPATH = _LONGPATH.replace(/\\/g, "\\\\"); //Delete \
      }
      ids++;
      const stats = fs.statSync(_LONGPATH);
      if (stats.isFile()) {
        //If it's file
        const element = document.createElement("div");
        element.setAttribute("class", "folder_list1");
        element.setAttribute("ID", ids + "B");
        element.setAttribute("name", paths[i]);
        element.setAttribute(
          "style",
          "margin-left:" +
            paddingListDir +
            "px; vertical-align: middle; width:" +
            Number(paths[i].length * 5 + 80) +
            "px;"
        );
        element.setAttribute("myPadding", paddingListDir);
        element.setAttribute("longPath", _LONGPATH);
        element.setAttribute("onClick", "createTab(this)");
        _SUBFOLDER.appendChild(element);
        const image = document.createElement("img");
        image.setAttribute("src", "src/icons/" + getFormat(paths[i]) + ".svg");
        image.setAttribute("style", "float:left; margin-right:3px;");
        const p = document.createElement("p");
        p.innerText = paths[i];
        element.appendChild(image);
        element.appendChild(p);
      }
    }
  });
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
    default:
      return "file";
  }
}
function createTab(object) {
  // create tabs on the element ' tabs_bar '
  if (tabsEqualToFiles.includes(object) === false) {
    const tab = document.createElement("div");
    tab.setAttribute("ID", object.id + "A");
    tab.setAttribute("longPath", object.getAttribute("longpath"));
    tab.setAttribute("class", "tabs");
    tab.style =
      "min-width: " +
      (object.getAttribute("name").length * 4 + 115) +
      "px; max-width: " +
      (object.getAttribute("name").length * 5 + 100) +
      "px";
    tab.setAttribute("onclick", "loadTab(this)");
    tab.setAttribute("file_status", "saved");

    const tab_text = document.createElement("p");
    tab_text.style = "float:left; text-align:center;";
    tab_text.innerText = object.getAttribute("name");

    const tab_x = document.createElement("button");
    tab_x.setAttribute("onClick", "deleteTab('" + object.id + "A')");
    tab_x.setAttribute("class", "close_tab");
    tab_x.setAttribute("hovering", "false");
    tab_x.innerHTML = close_icon;
    tab_x.addEventListener("mouseover", function (e) {
        this.setAttribute("hovering",true);
    });
    tab_x.addEventListener("mouseout", function (e) {
        this.setAttribute("hovering",false);
    });
    tab.appendChild(tab_text);
    tab.appendChild(tab_x);
    document.getElementById("tabs_bar").appendChild(tab);
    tabs.push(tab);
    tabsEqualToFiles.push(object);
    let NEWPATH__ = object.getAttribute("longPath");
    filepath = NEWPATH__;
    fs.readFile(NEWPATH__, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      tab.setAttribute("data", data);
      loadEditor(NEWPATH__, data);
      updateCodeMode(NEWPATH__);
      applyHighlighter(currentTheme);
      document.getElementById(editorID).style.height = " calc(100% - (50px))";
      editingTab = tab.id;
      selected = object;
      tabs.map(tab => {
        if (tab.classList.contains("selected")) {
          tab.classList.remove("selected");
        }
      });
      tab.classList.add("selected");
    });
  }
}
function deleteTab(ele) {
  const __OBJECT = document.getElementById(ele);
  tabs.map((tab, index) => {
   
    if (tab.id == ele) {
      tabsEqualToFiles.splice(index, 1);
      tabs.splice(index, 1);
      document
        .getElementById(__OBJECT.getAttribute("longPath") + "_editor")
        .remove();
      editors.splice(index + 1, 1);
      __OBJECT.remove();
      if (tabs.length === 0) {
        //0 tabs
        loadEditor("start");
        document.getElementById("body-space").style = " ";
        filepath = " ";
      } else if (index === tabs.length) {
        //Last tab
        var selected = tabs[Number(tabs.length) - 1];
      } else if (index >= 0) {
        var selected = tabs[index];
      }
      if (selected != undefined ) {
        tabs.map(tab => {
          if (tab.classList.contains("selected")) {
            tab.classList.remove("selected");
          }
        });
        editingTab = selected.id;
        selected.classList.add("selected");
        const __NEWPATH = selected.getAttribute("longPath");
        filepath = __NEWPATH;
        loadEditor(__NEWPATH, __OBJECT.getAttribute("data"));
        updateCodeMode(__NEWPATH);
        applyHighlighter(currentTheme);
      }
    }
  });
}
function loadTab(object) {
  if (object.id != editingTab && object.children[1].getAttribute("hovering") == "false") {
    tabs.map(tab => {
      if (tab.classList.contains("selected")) {
        tab.classList.remove("selected");
      }
    });
    object.classList.add("selected");
    const __NEWPATH = object.getAttribute("longPath");
    filepath = __NEWPATH;
    loadEditor(__NEWPATH, object.getAttribute("data"));
    updateCodeMode(__NEWPATH);
    editingTab = object.id;
    applyHighlighter(currentTheme);
  }
}
function updateCodeMode(path) {
  switch (path.split(".").pop()) {
    case "html":
      editor.setOption("mode", "htmlmixed");
      editor.setOption("htmlMode", true);
      plang = "HTML";
      break;
    case "css":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "css");
      plang = "CSS";
      break;
    case "js":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "javascript");
      plang = "JavaScript";
      break;
    case "json":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "javascript");
      plang = "JSON / JavaScript";
      break;
    case "go":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "go");
      plang = "Go";
      break;
    case "sql":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "sql");
      plang = "SQL";
      break;
    case "ruby":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "ruby");
      plang = "Ruby";
      break;
    case "php":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "php");
      plang = "PHP";
      break;
    case "sass":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "sass");
      plang = "Sass";
      break;
    case "dart":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "dart");
      plang = "Dart";
      break;
    case "Pascal":
      editor.setOption("htmlMode", false);
      editor.setOption("mode", "pascal");
      plang = "Pascal";
      break;
    default:
  }
}
var log = [];
function registerNewProject(dir) {
  //Add a new folder directory to the history if it is the firs time taht has been opened in the editor
  fs.readFile(logDir, "utf8", function(err, data) {
    if(err) return;
    log = JSON.parse(data);
    let __CONTINUE = true;
    for (i = 0; i < log.length; i++) {
      if (log[i].Path == dir) {
        __CONTINUE = false;
        return;
      }
    }
    if (__CONTINUE) {
      var new1 = {
        Name: path.basename(dir),
        Path: dir
      };
      log.unshift(new1);
      fs.writeFile(logDir, JSON.stringify(log), err => {});
    }
  });
}
function zenMode() {
  if (editor_mode == "zen") {
    editor_mode = "normal";
    document.getElementById("left-bar").style =
      "visibility: visible; width:180px;";
    document.getElementById("body-space").style = "margin:0px 0px 0px 180px";
  } else {
    editor_mode = "zen";
    document.getElementById("left-bar").style =
      "visibility: hidden; width:0px;";
    document.getElementById("body-space").style = "margin:0px";
  }
}
function _preview() {
  const url = require("url");
  const BrowserWindow = remote.BrowserWindow;
  if (_enable_preview === false) {
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

function openDevTools() {
  app.webContents.openDevTools();
}
function secondsToTime(secs) {
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  const obj = {
    h: hours,
    m: minutes,
    s: seconds
  };
  return obj;
}
