
const fs = require('fs'); 
const $ = require('jquery');
const path = require('path');
const {dialog} = require('electron').remote;
var i;
var tabs = [];
var tabsEqualToFiles = [];
var FirstFolder;
var touchTab = false;
var editingTab = " ";
var ids = 0;
const register = __dirname+"\\log.json";
let plang = " ";

function saveFileAs(){
  var content = document.getElementById('code-space').textContent;
  dialog.showSaveDialog((fileName) => {
      fs.writeFile(fileName, content, (err) => {
          if(err){
              alert("An error ocurred creating the file "+ err.message)
          }
          filepath = fileName;         
          alert("The file has been succesfully saved in " + fileName);
      });
  }); 
}

function openFile(){
  dialog.showOpenDialog((fileNames) => {
      // fileNames is an array that contains all the selected files
      if(fileNames === undefined){
          console.log("No file selected");
          return;
      }
      fs.readFile(fileNames[0], 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          myCodeMirror.setValue(data); //Updating data in the editor
      });
  });
}

function openFolder(){
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, selectedFiles => loadDirs(selectedFiles[0],"left-bar",'yes') )
}

function saveFile(){
  fs.writeFile(filepath, myCodeMirror.getValue(), (err) => {
    if (err) {
      alert("An error ocurred updating the file" + err.message);
      console.log(err);
      return;
    }
  });
}
function loadDirs(dir,appendID,ft){
  
  FirstFolder = dir;
  if(document.getElementById(appendID).getAttribute("opened")=="true"){
    document.getElementById(appendID).setAttribute("opened","false");
    document.getElementById(appendID).innerHTML = " ";
        var touch = document.createElement("div");
            touch.setAttribute("onClick","loadDirs('"+document.getElementById(appendID).getAttribute("longpath")+"','"+document.getElementById(appendID).getAttribute("id")+"','no')");
            touch.innerText = document.getElementById(appendID).getAttribute("name");
            touch.setAttribute("style"," width: "+Number(document.getElementById(appendID).getAttribute("myPadding"))+175+"px;");
            touch.setAttribute("class","folder_list2");
        var image = document.createElement('img');
            image.setAttribute("src","src/icons/closed.svg");
            image.setAttribute("style","float:left; margin-right:3px;");
        document.getElementById(appendID).appendChild(touch);  
            touch.appendChild(image);  
    return;
  }else{
    document.getElementById(appendID).setAttribute("opened","true");
    if(ft=="no"){
      var click =  document.getElementById(appendID).children[0];
      click.children[0].setAttribute("src","src/icons/open.svg");
    }
  }

  if(ft=="yes"){
    registerNewProject(dir); //
    var _folder1 = document.createElement('div');
    $(document.getElementById(appendID)).children().remove();
    _folder1.setAttribute('class','folder');
    _folder1.setAttribute('myPadding','50');
     _folder1.setAttribute('style','padding-left:12px; font-size:20px; padding-top:15px;');
    ids=0;
    _folder1.innerText = path.basename(dir);
    document.getElementById(appendID).appendChild(_folder1);
  }else{
    var _folder1 = document.getElementById(appendID); 
  }
  var paddingListDir = Number(document.getElementById(appendID).getAttribute("myPadding")) + 10; //Add padding
  fs.readdir(dir, (err, paths) => {
    paths.forEach(path => {
      var longPath= dir+ "\\"+path;
      longPath =  longPath.replace(/\\/g, '\\\\');
      ids++;  
      if (path.indexOf('.') > -1){
        //If is file
        var element = document.createElement('div');
          element.setAttribute("class","folder_list1");
          element.setAttribute("ID",ids+"B");
          element.setAttribute("name",path);
          element.setAttribute("style","margin-left:"+paddingListDir+"px; vertical-align: middle; width:"+(Number(210)+Number(paddingListDir))+"px;");
          element.setAttribute("myPadding",paddingListDir);
          element.setAttribute("longPath",longPath);
          element.setAttribute("onClick","createTab(this)");
          _folder1.appendChild(element);
        var image = document.createElement('img');
          image.setAttribute("src","src/icons/"+getFormat(path)+".svg");
          image.setAttribute("style","float:left; margin-right:3px;");
        var p = document.createElement('p');
          p.innerText = path;
          element.appendChild(image);
          element.appendChild(p);
     }else{
          //If is folder
        var element = document.createElement('div');
            element.setAttribute("opened","false");
            element.setAttribute("ID",ids);
            element.setAttribute("name",path);
            element.setAttribute("style","padding-left:"+paddingListDir+"px; vertical-align: middle;");
            element.setAttribute("myPadding",paddingListDir);
            element.setAttribute("longPath",longPath);
            _folder1.appendChild(element);
        var touch = document.createElement("div");
            touch.setAttribute("onClick","loadDirs('"+longPath+"','"+ids+"','no')");
            touch.innerText = path;
            touch.setAttribute("class"," folder_list2  ");
            touch.setAttribute("style"," width: "+(Number(175)+Number(paddingListDir))+"px;");
        var image = document.createElement('img');
          image.setAttribute("src","src/icons/closed.svg");
          image.setAttribute("style","float:left; margin-right:3px;");  
          element.appendChild(touch); 
          touch.appendChild(image);   
     }
    });
  });
}

function getFormat(text){
  var format = text.split('.').pop();
  switch (format){
    case "html":
    return "html";
    break;
    case "js":
    return "js";
    break;
    case "css":
    return "css";
    break;
    default:
    return "file";
  }
}

function createTab(object){ // create tabs on the element ' tabs_bar '
  
  if(tabsEqualToFiles.includes(object)===false){
    var tab = document.createElement("div");
    tab.setAttribute("ID",object.id+"A");
    tab.setAttribute("longPath",object.getAttribute("longpath"));
     tab.setAttribute("class","tabs");
     tab.setAttribute("onclick","loadTab(this)");
     tab.setAttribute("file_status","saved");
     
    var tab_text = document.createElement('p');
    tab_text.style="float:left; text-align:center;"
    tab_text.setAttribute("class","tab_text");
    tab_text.innerText = object.getAttribute("name");

    var tab_x = document.createElement("button");
    tab_x.setAttribute("onClick","deleteTab('"+object.id+"A')");
    tab_x.setAttribute("class","close_tab");
    tab_x.setAttribute("onmouseout","enableTab(false)");
    tab_x.setAttribute("onmouseover","enableTab(true)");

    tab.appendChild(tab_text);
    tab.appendChild(tab_x);
    document.getElementById("tabs_bar").appendChild(tab);
    tabs.push(tab);
    tabsEqualToFiles.push(object);
    var newPath = object.getAttribute("longPath");
    filepath = newPath;
    fs.readFile(newPath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      myCodeMirror.setValue(data); 
      updateCodeMode(newPath);
      //Updated data 
    });
  } 
}
function deleteTab(ele){
  var object= document.getElementById(ele);
  for(i=0; i<tabs.length; i++){
  
    if(tabs[i].id==ele)
    {
       tabsEqualToFiles.splice(i,1);
      tabs.splice(i,1);
      //myCodeMirror.setValue(" "); 
      object.remove();

      if(tabs.length === 0){ //Any tab

        updateCodeMode("open.js");
        myCodeMirror.setValue("open something :P"); 
        var selected = null;
        
      }else if(i=== tabs.length){

        var selected = tabs[(Number(tabs.length)-1)].getAttribute("longPath");
      
      }else if(i>=0 ){

        var selected = tabs[i].getAttribute("longPath");;
        
      }
      
    
      if(selected!=null){
        fs.readFile(selected, 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            myCodeMirror.setValue(data); 
            editingTab = object.id;
            updateCodeMode(selected);
            //Updated data 
        });
      }
     break;
    }
  }
} 
function enableTab(status){
  touchTab = status;
}
function bottomBar(text){
  var bar = document.getElementById("bottom-bar-text");
  bar.innerText = text;
  bar.style.visibility = "visible";
}

function loadTab(object){
  
  if(touchTab ===false && object.id != editingTab){

    var newPath = object.getAttribute("longPath");
    filepath = newPath;
    
    fs.readFile(newPath, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        myCodeMirror.setValue(data); 
        editingTab = object.id;
        updateCodeMode(newPath);
        //Updated data 
    });
  }
}

function updateCodeMode(path){

        switch(path.split('.').pop()){
          case "html":
          myCodeMirror.setOption("mode", "htmlmixed");
          myCodeMirror.setOption("htmlMode", true);
          plang = "HTML";
          break;
          case "css":
          myCodeMirror.setOption("htmlMode", false);
          myCodeMirror.setOption("mode", "css");
          plang = "CSS";
          break;
          case "js":
          myCodeMirror.setOption("htmlMode", false);
          myCodeMirror.setOption("mode", "javascript");
          plang = "Javascript";
          break;
          default:
        }
        loadBottom();
}
var log = [];
function registerNewProject(dir){ //Add a new folder directory to the history if it is the firs time taht has been opened in the editor
  fs.readFile(register, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    log = JSON.parse(data);
    var continue_ = true;
    for(i=0;i<log.length;i++){
      if(log[i].Path == dir) {
        continue_ = false; 
        return; 
      }
    }
    if(continue_){
      var new1 = {
        Name: path.basename(dir),
        Path: dir
      };
      log.push(new1);
      var json = JSON.stringify(log);
      fs.writeFile(register, json, (err) => { });
    }
  });
}
var editor_mode = "normal";
function zenMode(){
  if(editor_mode == "zen"){
    editor_mode = "normal";
    document.getElementById("left-bar").style ="visibility: visible; width:180px;";
    document.getElementById("body-space").style = "margin:0px 0px 0px 180px";
    document.getElementById("bottom-bar").style = "margin:0px 0px 0px 180px";
  }else{
    editor_mode = "zen";
    document.getElementById("left-bar").style ="visibility: hidden; width:0px;";
    document.getElementById("body-space").style = "margin:0px";
    document.getElementById("bottom-bar").style = "margin:0px";
  }
}

function createDialog(id,title,descriptions,button1,button2,action1,action2){
  var all = document.createElement("div");
  all.setAttribute("id",id+"D");
  all.setAttribute("style","-webkit-user-select: none;");

  var background = document.createElement("div");
  background.setAttribute("class","opened_window");
  background.setAttribute("id",id);
  background.setAttribute("onclick","closeDialog(this)");

  var body_dialog = document.createElement("div");
  body_dialog.setAttribute("class","dialog_body");
  body_dialog.innerHTML = `
  <p style="font-size:30px; line-height:3px; white-space: nowrap;">`+title+`</p>
  <p style="font-size:20px;">`+descriptions+`</p>
  <button class="button1_dialog" id="`+id+`" onclick="`+action1+`">`+button1+`</button>
  <button class="button2_dialog" id="`+id+`" onclick="`+action2+`">`+button2+`</button>
  `

  all.appendChild(background);
  all.appendChild(body_dialog);

  document.body.appendChild(all);
}
function closeDialog(me){
 
    let dialog = document.getElementById(me.id+"D");
    dialog.remove(); 
  
  
}

function loadBottom(){
  document.getElementById("plang").textContent = "Coding on "+plang;
}