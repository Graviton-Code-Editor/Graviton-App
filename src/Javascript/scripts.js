
const myVersion = 250119; //The release date
const version = "0.7.0"; //Tagged num
const currentOS = process.platform; //Detect the Operative System

var RealToday = JSON.stringify(new Date());
const close_icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate; " viewBox="0 0 24 24" width="24" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)"  vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" vector-effect="non-scaling-stroke" stroke-width="1"  stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg>`;

const { shell } = require('electron')
const fs = require('fs-extra'); 
const $ = require('jquery');
const path = require('path');
const {dialog} = require('electron').remote;
const mkdirp = require('mkdirp');

var i;
var DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton");
var tabs = [];
var tabsEqualToFiles = [];
var FirstFolder;
var touchTab = false;
var editingTab = " ";
var ids = 0;
let plang = " ";
var editorIsReady = false;
var _notifications = [];

    try {
        if(path.basename(__dirname) !=="Graviton-Editor") {
         DataFolderDir = path.join(path.join(__dirname, "..","..",".."), ".graviton");
        }
        if (!fs.existsSync(DataFolderDir)){
          fs.mkdirSync(DataFolderDir)    
        }
        var logDir = path.join(DataFolderDir, 'log.json');
        var configDir = path.join(DataFolderDir, 'config.json');
        var timeSpentDir = path.join(DataFolderDir, '_time_spent.json');
        var themes_folder = path.join(DataFolderDir,'themes');

    }catch (err) {
      console.error(err)
    }

  var myCodeMirror = CodeMirror(document.getElementById('code-space'), {
  value: `/*Welcome to Graviton!
Open some folder or file :)
*/
  `,
  mode:  "javascript",
  htmlMode : false,
  theme:'default',
  lineNumbers: true
});



 myCodeMirror.on("change", function() {
  if(editorIsReady === true){
    console.log(document.getElementById(editingTab).children[1]);
    document.getElementById(editingTab).setAttribute("file_status","unsaved");
    document.getElementById(editingTab).children[1].setAttribute("onclick","saveFile()");
    document.getElementById(editingTab).children[1].innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><ellipse vector-effect="non-scaling-stroke" cx="11.9999975" cy="11.9996439465" rx="6.303149298000001" ry="6.3035028515" fill="var(--accentColor)"/></svg>`;
    document.getElementById(editingTab).setAttribute("data",myCodeMirror.getValue());
  }

  });

function restartApp(){
  remote.app.relaunch();
  remote.app.exit(0);
}

function onChange(element){
    switch(element){
        case "time_spent_allow":
            if(allow_time_spent === "desactivated"){
              allow_time_spent = "activated";
              document.getElementById("graphicDiv").style = "";
            }else{
              allow_time_spent = "desactivated";
              document.getElementById("graphicDiv").style = "display:none"
            }
        break;
    }
}

function Notification(title,message) {


    if(_notifications.length >=3){
      _notifications[0].remove();
      _notifications.splice(0,1);
    }

    var all = document.createElement("div");
      all.classList.add("notificationBody");
      all.setAttribute("id",_notifications.length);
      all.innerHTML = `
      <button  class=" icon_border" onclick="closeNotification(this)">`+close_icon+`</button>
      <h1>`+title+`</h1>
      <p>`+message+`</p>`;
      _notifications.push(all);
    document.getElementById("notifications").appendChild(all);
    
    let seveTS = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        
          for(i = 0; i < _notifications.length;i++){
            console.log(_notifications);
            if(_notifications[i] === all){
               
               _notifications.splice(i,1);
              all.remove();
              
            }
          
          }
      }, 7000) 
  });
  
  let race = Promise.race([
    seveTS
  ]);

}
function closeNotification(element){
  for(i = 0; i < _notifications.length;i++){

    if(_notifications[i] === element.parentElement){
        console.log(_notifications);
        _notifications.splice(i,1);
        element.parentElement.remove();
              
    }
  }
}

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
    document.getElementById(editingTab).setAttribute("file_status","saved");
    document.getElementById(editingTab).children[1].setAttribute("onclick","deleteTab('"+editingTab+"')");
    document.getElementById(editingTab).children[1].innerHTML= close_icon;
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
    document.getElementById(appendID).setAttribute("opened","false");
    _folder1.setAttribute('class','folder');
    _folder1.setAttribute('myPadding','50');
     _folder1.setAttribute('style','padding:8px 10px 15px 15px; font-size:17px; ');
    ids=0;
    _folder1.innerText = path.basename(dir);
    document.getElementById(appendID).appendChild(_folder1);
  }else{
    var _folder1 = document.getElementById(appendID); 
  }

  
  var paddingListDir = Number(document.getElementById(appendID).getAttribute("myPadding")) + 5; //Add padding
  fs.readdir(dir, (err, paths) => {
    paths.forEach(dir2 => {
      var longPath=  path.join(dir, dir2);
      if(currentOS=="win32"){
        longPath =  longPath.replace(/\\/g, '\\\\'); //Delete \
    }
      ids++;  
      if (dir2.indexOf('.') > -1){
        //If is file
        var element = document.createElement('div');
          element.setAttribute("class","folder_list1");
          element.setAttribute("ID",ids+"B");
          element.setAttribute("name",dir2);
          element.setAttribute("style","margin-left:"+paddingListDir+"px; vertical-align: middle; width:"+(Number(210)+Number(paddingListDir))+"px;");
          element.setAttribute("myPadding",paddingListDir);
          element.setAttribute("longPath",longPath);
          element.setAttribute("onClick","createTab(this)");
          _folder1.appendChild(element);
        var image = document.createElement('img');
          image.setAttribute("src","src/icons/"+getFormat(dir2)+".svg");
          image.setAttribute("style","float:left; margin-right:3px;");
        var p = document.createElement('p');
          p.innerText = dir2;
          element.appendChild(image);
          element.appendChild(p);
     }else{
          //If is folder
        var element = document.createElement('div');
            element.setAttribute("opened","false");
            element.setAttribute("ID",ids);
            element.setAttribute("name",dir2);
            element.setAttribute("style","padding-left:"+paddingListDir+"px; vertical-align: middle;");
            element.setAttribute("myPadding",paddingListDir);
            element.setAttribute("longPath",longPath);
            _folder1.appendChild(element);
        var touch = document.createElement("div");
            touch.setAttribute("onClick","loadDirs('"+longPath+"','"+ids+"','no')");
            touch.innerText = dir2;
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
    tab_text.innerText = object.getAttribute("name");

    var tab_x = document.createElement("button");
    tab_x.setAttribute("onClick","deleteTab('"+object.id+"A')");
    tab_x.setAttribute("class","close_tab");
    tab_x.setAttribute("onmouseout","enableTab(false)");
    tab_x.setAttribute("onmouseover","enableTab(true)");
    tab_x.innerHTML = close_icon;
    tab.appendChild(tab_text);
    tab.appendChild(tab_x);
    document.getElementById("tabs_bar").appendChild(tab);
    tabs.push(tab);
    tabsEqualToFiles.push(object);
    selected = object;
    var newPath = object.getAttribute("longPath");
    filepath = newPath;
    fs.readFile(newPath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      editorIsReady = false;
      tab.setAttribute("data",data);
      myCodeMirror.setValue(data); 
      updateCodeMode(newPath);
      editorIsReady = true;
      //Updated data 
    });
    editingTab = tab.id;
    


    tabs.map((tab)=>{
      if(tab.classList.contains("selected")){
        tab.classList.remove("selected");
      }
    })
    tab.classList.add("selected");

  } 
}
function deleteTab(ele){
  editorIsReady = false;
  var object= document.getElementById(ele);
  tabs.map((tab,index) =>{

    if(tab.id==ele)
    {
       tabsEqualToFiles.splice(index,1);
      tabs.splice(index,1);
      //myCodeMirror.setValue(" "); 
      object.remove();

      if(tabs.length === 0){ //0 tabs
        updateCodeMode("open.js");
        myCodeMirror.setValue("Open something :p");        
      }else if(index=== tabs.length){ //Last tab
        var selected = tabs[(Number(tabs.length)-1)];
      }else if(index>=0 ){
        var selected = tabs[index];
      }
          
      if(selected!=null){
        tabs.map((tab)=>{
          if(tab.classList.contains("selected")){
          tab.classList.remove("selected");
          }
       })
        selected.classList.add("selected");
        editorIsReady = false;
        var newPath = selected.getAttribute("longPath");
        filepath = newPath;
            
        myCodeMirror.setValue(selected.getAttribute("data")); 
        editingTab = selected.id;
        updateCodeMode(newPath);
        editorIsReady = true;
      }
     
    }
  });
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
    tabs.map((tab)=>{
      if(tab.classList.contains("selected")){
        tab.classList.remove("selected");
      }
    })
    object.classList.add("selected");
    editorIsReady = false;
    var newPath = object.getAttribute("longPath");
    filepath = newPath;
    
    myCodeMirror.setValue(object.getAttribute("data")); 
        editingTab = object.id;
        updateCodeMode(newPath);
        editorIsReady = true;
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
}
var log = [];
function registerNewProject(dir){ //Add a new folder directory to the history if it is the firs time taht has been opened in the editor
  fs.readFile(logDir, 'utf8', function (err,data) {
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
      fs.writeFile(logDir, json, (err) => { });
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
  <p style="font-size:20px; line-height:3px; white-space: nowrap; font-weight:bold;">`+title+`</p>
  <p style="font-size:15px;">`+descriptions+`</p>
  <button class="_dialog_button" id="`+id+`" onclick="`+action1+`">`+button1+`</button>
  <button class="_dialog_button" id="`+id+`" onclick="`+action2+`">`+button2+`</button>
  `;

  all.appendChild(background);
  all.appendChild(body_dialog);

  document.body.appendChild(all);
}
function closeDialog(me){
 
    let dialog = document.getElementById(me.id+"D");
    dialog.remove(); 
  
}


