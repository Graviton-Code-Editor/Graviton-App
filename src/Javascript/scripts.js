const dateVersion = 160319; //The release date
const version = "0.7.1"; //Tagged num


var RealToday = JSON.stringify(new Date());
const close_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate; " viewBox="0 0 24 24" width="24" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)"  vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg>`;

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
var touchTab = false;
var editingTab = " ";
var ids = 0;
let plang = " ";
var editorIsReady = false;
var _notifications = [];
var filepath = "start";
var editors = [];
var editor;
var editorID;
try {
  if (path.basename(__dirname) !== "Graviton-Editor") {
    DataFolderDir = path.join(
      path.join(__dirname, "..", "..", ".."),
      ".graviton"
    );
  }
  if (!fs.existsSync(DataFolderDir)) {
    fs.mkdirSync(DataFolderDir);
  }
  var logDir = path.join(DataFolderDir, "log.json");
  var configDir = path.join(DataFolderDir, "config.json");
  var timeSpentDir = path.join(DataFolderDir, "_time_spent.json");
  var themes_folder = path.join(DataFolderDir, "themes");
  var highlights_folder = path.join(DataFolderDir, "highlights");
  var plugins_folder = path.join(DataFolderDir, "plugins");
  var plugins_db = path.join(DataFolderDir, "plugins_db");
} catch (err) {
  console.error(err);
}

function loadEditor(path, data) {
  if (document.getElementById(path + "_editor") == undefined) {
    //Editor doesn't exist
    const element = document.createElement("div");
    element.classList = "code-space";
    element.setAttribute("id", path + "_editor");
    document.getElementById("body-space").appendChild(element);
    var codemirror = CodeMirror(document.getElementById(path + "_editor"), {
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

var dictionary = autocomplete.javascript;

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
    if (editorIsReady === true) {
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

  var cursorPos = editor.cursorCoords();

  //Getting Last Word

  var A1 = editor.getCursor().line;
  var A2 = editor.getCursor().ch;

  var B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
  var B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

  var lastWord = editor.getRange({line: A1,ch: B1}, {line: A1,ch: B2});

  //Context Menu

  filterIt(dictionary, lastWord, function(filterResult){
    if (filterResult.length > 0 && lastWord.length >= 3) {
      var contextOptions;
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
      var A1 = editor.getCursor().line;
      var A2 = editor.getCursor().ch;

      var B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
      var B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

      var selected = $(this).text();
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
  var A1 = editor.getCursor().line;
  var A2 = editor.getCursor().ch;

  var B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
  var B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

  var selected = $(this).text();
  editor.replaceRange(selected, {line: A1,ch: B1}, {line: A1,ch: B2});
  $("context").fadeOut();
  $("context .menuWrapper").html("");
  e.preventDefault();
})

  editor.on("change", function() {
    //Previewer
    if (editorIsReady === true) {
      setTimeout(function() {
        if (editor.getCurrentFile != undefined && _enable_preview === true) {
          saveFile();
          _previewer.reload();
        }
      }, 500);
    }
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

editor.setOption("extraKeys", {
  Ctrl: function(editor) {  z
    console.log("c");
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
    selectedFiles => loadDirs(selectedFiles[0], "left-bar", "yes")
  );
}

function saveFile() {
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
function loadDirs(dir, appendID, ft) {
  FirstFolder = dir;
  var me = document.getElementById(appendID);
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
    if (ft == "no") {
      var click = document.getElementById(appendID).children[0];
      click.children[0].setAttribute("src", "src/icons/open.svg");
    }
  }
  if (ft == "yes") {
    registerNewProject(dir); //
    var _folder1 = document.createElement("div");
    for (i = 0; i < document.getElementById(appendID).children.length; i++) {
      document.getElementById(appendID).children[i].remove();
    }
    document.getElementById(appendID).setAttribute("opened", "false");
    _folder1.setAttribute("class", "folder");
    _folder1.setAttribute("myPadding", "50");
    _folder1.setAttribute("style", "margin:10px 20px; font-size:17px; ");
    ids = 0;
    _folder1.innerText = path.basename(dir);
    document.getElementById(appendID).appendChild(_folder1);
  } else {
    var _folder1 = document.getElementById(appendID);
  }

  var paddingListDir =
    Number(document.getElementById(appendID).getAttribute("myPadding")) + 5; //Add padding
  fs.readdir(dir, (err, paths) => {
    for (i = 0; i < paths.length; i++) {
      var dir2 = paths[i];

      var longPath = path.join(dir, dir2);
      if (graviton.currentOS() == "win32") {
        longPath = longPath.replace(/\\/g, "\\\\");
      }
      ids++;
      const stats = fs.statSync(longPath);
      if (stats.isDirectory()) {
        //If is folder
        const element = document.createElement("div");
        element.setAttribute("opened", "false");
        element.setAttribute("ID", ids);
        element.setAttribute("name", dir2);
        element.setAttribute(
          "style",
          "padding-left:" + paddingListDir + "px; vertical-align: middle;"
        );
        element.setAttribute("myPadding", paddingListDir);
        element.setAttribute("longPath", longPath);
        
        const touch = document.createElement("div");
        touch.setAttribute(
          "onClick",
          "loadDirs('" + longPath + "','" + ids + "','no')"
        );
        touch.innerText = dir2;
        touch.setAttribute("class", " folder_list2  ");
        touch.setAttribute(
          "style",
          " width: " + Number(dir2.length * 6 + 55) + "px;"
        );
        const image = document.createElement("img");
        image.setAttribute("src", "src/icons/closed.svg");
        image.setAttribute("style", "float:left; margin-right:3px;");
        element.appendChild(touch);
        touch.appendChild(image);
        _folder1.appendChild(element);
      }
    }

    for (i = 0; i < paths.length; i++) {
      var dir2 = paths[i];

      var longPath = path.join(dir, dir2);
      if (graviton.currentOS() == "win32") {
        longPath = longPath.replace(/\\/g, "\\\\"); //Delete \
      }
      ids++;
      const stats = fs.statSync(longPath);
      if (stats.isFile()) {
        //If it's file
        const element = document.createElement("div");
        element.setAttribute("class", "folder_list1");
        element.setAttribute("ID", ids + "B");
        element.setAttribute("name", dir2);
        element.setAttribute(
          "style",
          "margin-left:" +
            paddingListDir +
            "px; vertical-align: middle; width:" +
            Number(dir2.length * 6 + 55) +
            "px;"
        );
        element.setAttribute("myPadding", paddingListDir);
        element.setAttribute("longPath", longPath);
        element.setAttribute("onClick", "createTab(this)");
        _folder1.appendChild(element);
        const image = document.createElement("img");
        image.setAttribute("src", "src/icons/" + getFormat(dir2) + ".svg");
        image.setAttribute("style", "float:left; margin-right:3px;");
        const p = document.createElement("p");
        p.innerText = dir2;
        element.appendChild(image);
        element.appendChild(p);
      }
    }
  });
}

function getFormat(text) {
  var format = text.split(".").pop();
  switch (format) {
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
    var tab = document.createElement("div");
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

    var tab_text = document.createElement("p");
    tab_text.style = "float:left; text-align:center;";
    tab_text.innerText = object.getAttribute("name");

    var tab_x = document.createElement("button");
    tab_x.setAttribute("onClick", "deleteTab('" + object.id + "A')");
    tab_x.setAttribute("class", "close_tab");
    tab_x.setAttribute("onmouseout", "enableTab(false)");
    tab_x.setAttribute("onmouseover", "enableTab(true)");
    tab_x.innerHTML = close_icon;
    tab.appendChild(tab_text);
    tab.appendChild(tab_x);
    document.getElementById("tabs_bar").appendChild(tab);
    tabs.push(tab);
    tabsEqualToFiles.push(object);
    var newPath = object.getAttribute("longPath");
    filepath = newPath;
    fs.readFile(newPath, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      editorIsReady = false;
      tab.setAttribute("data", data);
      loadEditor(newPath, data);
      updateCodeMode(newPath);
      applyHighlighter(currentTheme);
      touchTab = false;
      editorIsReady = true;

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
  editorIsReady = false;
  var object = document.getElementById(ele);
  tabs.map((tab, index) => {
    if (tab.id == ele) {
      tabsEqualToFiles.splice(index, 1);
      tabs.splice(index, 1);
      document
        .getElementById(object.getAttribute("longPath") + "_editor")
        .remove();
      editors.splice(index + 1, 1);

      object.remove();

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

      if (selected != null) {
        tabs.map(tab => {
          if (tab.classList.contains("selected")) {
            tab.classList.remove("selected");
          }
        });
        selected.classList.add("selected");
        editorIsReady = false;
        var newPath = selected.getAttribute("longPath");
        filepath = newPath;
        loadEditor(newPath, object.getAttribute("data"));
        updateCodeMode(newPath);
        editingTab = selected.id;
        applyHighlighter(currentTheme);
      }
    }
  });
}
function enableTab(status) {
  touchTab = status;
}
function bottomBar(text) {
  var bar = document.getElementById("bottom-bar-text");
  bar.innerText = text;
  bar.style.visibility = "visible";
}

function loadTab(object) {
  if (touchTab === false && object.id != editingTab) {
    tabs.map(tab => {
      if (tab.classList.contains("selected")) {
        tab.classList.remove("selected");
      }
    });
    object.classList.add("selected");
    editorIsReady = false;
    var newPath = object.getAttribute("longPath");
    filepath = newPath;

    loadEditor(newPath, object.getAttribute("data"));
    updateCodeMode(newPath);
    editingTab = object.id;
    applyHighlighter(currentTheme);
    editorIsReady = true;
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
    default:
  }
}
var log = [];
function registerNewProject(dir) {
  //Add a new folder directory to the history if it is the firs time taht has been opened in the editor
  fs.readFile(logDir, "utf8", function(err, data) {
    console.log(!err ? "" : err);
    log = JSON.parse(data);
    var continue_ = true;
    for (i = 0; i < log.length; i++) {
      if (log[i].Path == dir) {
        continue_ = false;
        return;
      }
    }
    if (continue_) {
      var new1 = {
        Name: path.basename(dir),
        Path: dir
      };
      log.unshift(new1);
      var json = JSON.stringify(log);
      fs.writeFile(logDir, json, err => {});
    }
  });
}
var editor_mode = "normal";
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


var _previewer;
var _enable_preview = false;
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
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);

  var obj = {
    h: hours,
    m: minutes,
    s: seconds
  };
  return obj;
}
