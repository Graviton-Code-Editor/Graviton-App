/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_version = {
  date: "190602",
  version: "0.7.7",
  state: "Alpha"
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
let default_editor;
let dir_path;
let i;
let DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton");
let tabs = [];
let tabsEqualToFiles = [];
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
const loadEditor = (dir, data, type,screen) => {
  if (document.getElementById(dir + "_editor") == undefined) {
    //Editor doesn't exist
    switch (type) {
      case "text":
        let text_container = document.createElement("div");
        text_container.classList = "code-space";
        text_container.setAttribute("id", dir + "_editor");
        document.getElementById(default_editor.id).children[2].appendChild(text_container);
        let codemirror = CodeMirror(document.getElementById(dir + "_editor"), {
          value: data,
          mode: "text/plain",
          htmlMode: false,
          theme: themeObject["Highlight"],
          lineNumbers: true,
          autoCloseTags: true,
          indentUnit: 3,
          id:dir,
          styleActiveLine: true,
          lineWrapping: current_config["lineWrappingPreferences"] == "activated"
        });
        document.getElementById(default_editor.id).children[3].children[0].innerText = getFormat(path.basename(dir));
        const new_editor_text = {
          id: dir + "_editor",
          editor: codemirror,
          path: dir,
          screen: screen
        };
        editors.push(new_editor_text);
        
        for (i = 0; i < editors.length; i++) {
          if (editors[i].screen == screen && document.getElementById(editors[i].id) != null) {
            document.getElementById(editors[i].id).style.display = "none";
          }
        }
        editorID = new_editor_text.id;
        editor = new_editor_text.editor;
        document.getElementById(dir + "_editor").style.display = "block";
        codemirror.on("focus",function(a){
            for(i=0;i<editors.length;i++){
              if(editors[i].id==a.options.id+"_editor"){
                editor = editors[i].editor;
                editorID = editors[i].id
                for (let b = 0; b < tabs.length; b++) {
                  if (tabs[b].getAttribute("screen") == editors[i].screen && tabs[b].classList.contains("selected")) {
                    editingTab = tabs[b].id;
                  }
                } 
              }
            }
        })
        break;
      case "image":
        const image_container = document.createElement("div");
        image_container.classList = "code-space";
        image_container.setAttribute("id", `${dir}_editor`);
        image_container.innerHTML = `<img src="${dir}">`
        document.getElementById(default_editor.id).children[1].children[2].appendChild(image_container);
        const new_editor_image = {
          id: dir + "_editor",
          editor: undefined,
          path: dir,
          screen: screen
        };
        if (document.getElementById(editorID) != undefined) document.getElementById(editorID).style.display = "none";
        for (i = 0; i < editors.length; i++) {
          if (editors[i].screen == screen && document.getElementById(editors[i].id) != null) {
            document.getElementById(editors[i].id).style.display = "none";
          }
        }
        editors.push(new_editor_image);
        document.getElementById(dir + "_editor").style.display = "block";
        editorID = new_editor_image.id;
        document.getElementById(default_editor).children[3].children[0].innerText = path.basename(dir).split(".").pop();
        break;
    }
  } else { //Editor exists
    for (i = 0; i < editors.length; i++) {
      console.log(editors[i].screen, screen);
      if (editors[i].screen == screen && document.getElementById(editors[i].id) != null) {
        document.getElementById(editors[i].id).style.display = "none";
        console.log("selected");
      }
      if (editors[i].id == dir + "_editor") {
        if (editors[i].editor != undefined) {
          editor = editors[i].editor;
          editor.refresh();
          document.getElementById(default_editor).children[3].children[0].innerText = getFormat(path.basename(editors[i].path));
        } else {
          document.getElementById(default_editor).children[3].children[0].innerText = path.basename(dir).split(".").pop();
        }
        editorID = editors[i].id;
        document.getElementById(editorID).style.display = "block";
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
      close_icon.children[1].setAttribute("onclick", "save_file_warn(this)");
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
          } else if (filterResult.length === 0 || lastWord.length < 3) {
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
    new tab({
      id: Math.random()+ fileNames[0].replace(/\\/g, "\\\\") + "B",
      longPath:fileNames[0],
      name:fileNames[0]
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
          <div style=" width:${Number(paths[i].length * 6 + 55)}px;" class="folder_list2" onclick="loadDirs('${_long_path}','${ids+dir.replace(/\\/g, "")}',false)">
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
        <div onclick="new tab({
          id:'${ids+ dir.replace(/\\/g, "") + "B"}',
          longPath:'${_long_path}',
          name:'${paths[i]}'
        })" myPadding="${paddingListDir}" longPath="${_long_path}" class="folder_list1" ID="${ids+ dir + "B"}" name="${paths[i]}" style="width:${paths[i].length * 6 + 55}px; margin-left:${paddingListDir}px; vertical-align:middle;">
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
class tab {
  constructor(object) {
    for (i = 0; i < tabsEqualToFiles.length + 1; i++) {
      if (i != tabsEqualToFiles.length && tabsEqualToFiles[i].longPath === object.longPath){
        return;
      } else if (i == tabsEqualToFiles.length) { //Tab is created because it doesn't exist
        document.getElementById(default_editor.id).children[1].style = "visibility:hidden; display:none;"
        console.log(document.getElementById(default_editor.id));
        const tab = document.createElement("div");
        tab.setAttribute("id", object.id + "Tab");
        tab.setAttribute("TabID", object.id + "Tab");
        tab.setAttribute("longPath", object.longPath);
        tab.setAttribute("screen",default_editor.id);
        tab.setAttribute("class", "tabs");
        tab.setAttribute("elementType", "tab");
        console.log(tab);
        tab.style =`min-width: ${(object.name.length * 4 + 115)}px; 
        max-width: ${(object.name.length * 5 + 100)}px`;
        tab.setAttribute("onclick", "g_load_tab(this)");
        tab.setAttribute("file_status", "saved");
        tab.innerHTML += `<p id="${object.id + "TextTab"}" TabID="${object.id}Tab" elementType="tab">${object.name}</p>`
        const tab_x = document.createElement("button");
        tab_x.setAttribute("onclose", `g_close_tab("${ object.id }Tab");`);
        tab_x.setAttribute("onclick", `g_close_tab("${ object.id }Tab");`);
        tab_x.setAttribute("class", "close_tab");
        tab_x.setAttribute("hovering", "false");
        tab_x.setAttribute("elementType", "tab");
        tab_x.setAttribute("TabID", object.id + "Tab");
        tab_x.setAttribute("id", object.id + "CloseButton");
        tab_x.innerHTML = close_icon;
        tab_x.addEventListener("mouseover", function(e) {
          this.setAttribute("hovering", true);
        });
        tab_x.addEventListener("mouseout", function(e) {
          this.setAttribute("hovering", false);
        });
        tab.appendChild(tab_x);
        document.getElementById(default_editor.id).children[0].appendChild(tab);
        tabs.push(tab);
        tabsEqualToFiles.push(object);
        const g_newPath = object.longPath;
        filepath = g_newPath;
        switch (filepath.split(".").pop()) {
          case "svg":
          case "png":
          case "ico":
          case "jpg":
            for (i = 0; i < tabs.length; i++) {
              if (tabs[i].getAttribute("screen") == default_editor.id && tabs[i].classList.contains("selected")) {
                tabs[i].classList.remove("selected");
              }
            }
            tab.classList.add("selected");
            editingTab = tab.id;
            loadEditor(filepath, null, "image",default_editor.id);
            break;
          default:
            fs.readFile(g_newPath, "utf8", function(err, data) {
              if (err) return console.err(err);
              tab.setAttribute("data", data);
              for (i = 0; i < tabs.length; i++) {
                if (tabs[i].getAttribute("screen") == default_editor.id && tabs[i].classList.contains("selected")) {
                  tabs[i].classList.remove("selected");
                }
              }
              tab.classList.add("selected");
              editingTab = tab.id;
              loadEditor(g_newPath, data, "text",default_editor.id);
              if (g_highlighting == "activated") updateCodeMode(g_newPath);
              editor.refresh();
            });
        }
        return;
      }
    }
  }
}
const g_close_tab = tab_id => {
  const g_object = document.getElementById(tab_id);
  for (i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    let new_selected_tab;
    if (tab.id == tab_id && tab.getAttribute("screen") == g_object.getAttribute("screen")) {
      tabsEqualToFiles.splice(i, 1);
      tabs.splice(i, 1);
      document
        .getElementById(g_object.getAttribute("longPath") + "_editor")
        .remove();
      editors.splice(i , 1);
      g_object.remove();
      if (tabs.length === 0) { //Any tab opened
        filepath = " ";
        plang = "";
        document.getElementById(default_editor.id).children[2].innerText = plang;
        document.getElementById(default_editor.id).children[1].style = "visibility:visible; display:block;"
      } else if (i === tabs.length) { //Last tab selected
        for(i = 0; i < tabs.length; i++) {
          if(tabs[i].getAttribute("screen") == g_object.getAttribute("screen")){
            new_selected_tab = tabs[Number(tabs.length) - 1];
          
          } 
        }
      } else {
        for(i = 0; i < tabs.length; i++) {
          if(tabs[i].getAttribute("screen") == g_object.getAttribute("screen")){
            new_selected_tab = tabs[i];
            
          } 
        }
      }
      if (new_selected_tab != undefined) {
        for (i = 0; i < tabs.length; i++) {
          if (tabs[i].classList.contains("selected") && tabs[i].getAttribute("screen") == g_object.getAttribute("screen")) {
            tabs[i].classList.remove("selected");
          }
        }
        editingTab = new_selected_tab.id;
        new_selected_tab.classList.add("selected");
        const g_newPath = new_selected_tab.getAttribute("longpath");
        filepath = g_newPath;
        loadEditor(g_newPath, g_object.getAttribute("data"), "text",default_editor.id);
        if (g_highlighting == "activated") updateCodeMode(g_newPath);
      }
    }
  }
}
const g_load_tab = object => {
  const object_screen = object.getAttribute("screen");
  if (object.id != editingTab && object.children[1].getAttribute("hovering") == "false") {
    for (i = 0; i < tabs.length; i++) {
       if (tabs[i].classList.contains("selected") && tabs[i].getAttribute("screen") == object_screen) {
        tabs[i].classList.remove("selected");
      }
    }
    object.classList.add("selected");
    const g_newPath = object.getAttribute("longPath");
    filepath = g_newPath
    loadEditor(g_newPath, object.getAttribute("data"),undefined,object.getAttribute("screen"));
    if (g_highlighting == "activated") updateCodeMode(g_newPath);
    editingTab = object.id;
  }
}
function updateCodeMode(path) {
  if (g_highlighting == "activated") {
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
      case "pascal":
        editor.setOption("htmlMode", false);
        editor.setOption("mode", "pascal");
        plang = "Pascal";
        break;
      case "md":
        editor.setOption("htmlMode", false);
        editor.setOption("mode", "markdown");
        plang = "Markdown";
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
  } else {
    editor_mode = "zen";
    document.getElementById("g_explorer").style = "visibility: hidden; width:0px; display:none;";
  }
}
const g_preview = function() {
  const url = require("url");
  const BrowserWindow = remote.BrowserWindow;
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
    </div>
  `
  })
  new_projects_window.launch()
}
const preload = (array) => { //Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
    <img id="${array[i]}"src="${array[i]}"></img>`
    document.getElementById(array[i]).remove();
  }
}
function touchingResizer(type){
  if(type==false){
    if(!mouseClicked){
      touchingResizerValue = false;
    }
  }else{
      touchingResizerValue = true;
  }
}
let editor_screens = [];
function addScreen(){
  const new_screen_editor = document.createElement("div");
  new_screen_editor.classList = "g_editors"
  new_screen_editor.id = Math.random();
  new_screen_editor.innerHTML=`
     <div class="g_tabs_bar flex" ></div>  
      <p class="translate_word" idT="WelcomeMessage" class="temp_dir_message" ></p>
      <div class="g_editors_editors">
      </div>
      <div class="g_status_bar" >
        <span ></span>
      </div>
  `
  document.getElementById("g_content").insertBefore(new_screen_editor, document.getElementById("g_content").children[2])
  editor_screens.push({
    id:new_screen_editor.id
  })
  default_editor = editor_screens[editor_screens.length-1]
  new_screen_editor.addEventListener('click', function(event) { 
    console.log(this.id)
    default_editor.id = this.id
  }, true);

}