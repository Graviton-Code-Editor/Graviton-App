/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
/* <-- Default NavBar >-- */
let full_plugins = [];
let anyDropON = null
const File = new dropMenu({
  id: 'file',
  translation: true
})
const Tools = new dropMenu({
  if: 'tools',
  translation: true
})
const Editor = new dropMenu({
  id: 'editor',
  translation: true
})
const WindowDM = new dropMenu({
  id: 'window',
  translation: true
})
const Help = new dropMenu({
  id: 'help',
  translation: true
})

File.setList({
  button: 'File',
  list: {
    'Open Folder':()=> openFolder(),
    'Open File': ()=>openFile(),
    'Save As': ()=>saveFileAs(),
    'Save': {
      click: ()=>saveFile(),
      hint: 'Ctrl+S'
    },
    '*line': '',
    'New Project': ()=>g_NewProjects(),
    'space1': '*line',
    Exit: {
      click:()=>remote.app.exit(0),
      icon:'exit'
    }
  }
})
Tools.setList({
  button: 'Tools',
  list: {
    Market:()=>{
      extensions.openStore(function(err){
        extensions.navigate("all",err)
      });
      
    },
    'ShowWelcome': ()=>g_welcomePage(),
    "1a":"*line",
    "Search":{
      click:()=>graviton.editorSearch(),
      hint:"Ctrl+F"
    },
    "Replace":{
      click:()=>graviton.editorReplace(),
      hint:"Ctrl+Shit+R"
    },
    "JumpToLine":{
      click:()=>graviton.editorJumpToLine(),
      hint:"Alt+G"
    },
    '2a': '*line',
    Settings: ()=>{
      Settings.open(); 
      Settings.navigate('1')
    }
  }
})
Editor.setList({
  button: 'Editor',
  list: {
    'Zen Mode': {
      click: ()=>graviton.toggleZenMode(),
      hint: 'Ctrl+E'
    },
    'a1': '*line',
    'DefaultView': ()=>screens.default(),
    'SplitScreen': {
      click:()=>screens.add(),
      icon: 'split_screen',
      hint: 'Ctrl+N'
    },
    'RemoveScreen': {
      click: ()=>graviton.removeScreen(),
      icon: 'remove_screen',
      hint: 'Ctrl+L'
    },
    'a2': '*line',
    'newTerminal': {
      click: ()=>commanders.terminal(),
      icon: 'new_terminal',
      hint:"Ctrl+T"
    },
    'closeTerminal': {
      click: ()=>commanders.closeTerminal(),
      icon: 'close_terminal',
      hint:"Ctrl+U"
    }
  }
})
WindowDM.setList({
  button: 'Window',
  list: {
    'Developer Tools': ()=>graviton.openDevTools(),
    "1a":"*line",
    "HideMenus": {
      click:()=>{
        graviton.toggleMenus(); 
        new Notification(getTranslation('Tip'),getTranslation('ToggleMenuTipMessage'))
      },
      hint:"Ctrl+Q"
    },
    "2a":"*line",
    "IncreaseZoom": {
      click:()=>graviton.setZoom(parseInt(current_config.appZoom)+3),
      hint:"Ctrl+shift+plus",
      icon:"plus_zoom"
    },
    "DicreaseZoom":  {
      click:()=>graviton.setZoom(parseInt(current_config.appZoom)+-3),
      hint:"Ctrl+minus",
      icon:"minus_zoom"
    },
    "DefaultZoom": {
      click:()=>graviton.setZoom(25),
      icon:"default_zoom"
    },
    'Fullscreen':{
      click:()=>graviton.toggleFullScreen(),
      hint:"F11"
    } 
  }
})
Help.setList({
  button: 'Help',
  list: {
    Issues: ()=> shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/issues'),
    'Source Code': ()=>shell.openExternal('https://github.com/Graviton-Code-Editor'),
    'Telegram Channel': ()=>shell.openExternal('https://t.me/gravitoneditor'),
    'Telegram Group': ()=>shell.openExternal('https://t.me/joinchat/FgdqbBRNJjpSHPHuDRMzfQ'),
    '*line': '',
    Donate: ()=>shell.openExternal('https://www.paypal.me/mkenzo8'),
    FAQs: ()=>shell.openExternal('https://www.graviton.ml/faqs'),
    Changelog: ()=>graviton.dialogChangelog(),
    Website: ()=>shell.openExternal('https://www.graviton.ml'),
    About: {
      click: ()=>graviton.dialogAbout(),
      icon: 'info'
    }
  }
})

function interact_dropmenu (id) {
  const dropdowns = document.getElementsByClassName('dropdown-content')
  for (i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].id != id) {
      dropdowns[i].classList.replace('show', 'hide') // Close the other menus
    } else {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.replace('show', 'hide') // Hide the clicked menu
        anyDropON = null
      } else {
        dropdowns[i].classList.replace('hide', 'show') // Show the clicked menu
        anyDropON = id
      }
    }
  }
}
// Close all dropdowns if the user clicks outside
window.onclick = function (event) {
  if (!(event.target.matches('.dropbtn') || event.target.matches('.icon_border'))) {
    const dropdowns = document.getElementsByClassName('dropdown-content')
    time_spent_graphic_counter = false
    for (i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.replace('show', 'hide')
        anyDropON = null
      }
    }
  }
}

const windows_buttons = `
  <button onclick="g_window.minimize(); " id="minimize" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><rect x="7" y="11.5" width="10" height="0.8" transform="matrix(1,0,0,1,0,0)" fill="var(--titleBar-icons-color)"/></svg></button>
  <button onclick="g_window.maximize(); " id="maximize" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 24 24" width="24" height="24"><rect x="7.5" y="7.5" width="9" height="9" transform="matrix(1,0,0,1,0,0)" fill="transparent" vector-effect="non-scaling-stroke" stroke-width="1" stroke="var(--titleBar-icons-color)" stroke-linejoin="miter" stroke-linecap="square" /></svg></button>
  <button onclick="g_window.close();" id="close" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="20" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)" fill="var(--titleBar-icons-color)" /><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" fill="var(--titleBar-icons-color)" /></svg></button>
`;
if (graviton.currentOS().codename == 'win32') {
  document.getElementById('controls').innerHTML = windows_buttons
  g_window.on('maximize', (e, cmd) => {
    document.getElementById('maximize').setAttribute('onclick', 'g_window.unmaximize();')
  })
  g_window.on('unmaximize', (e, cmd) => {
    document.getElementById('maximize').setAttribute('onclick', 'g_window.maximize();')
  })
} else {
  document.getElementById('controls').innerHTML = ' '
  document.getElementById('controls').setAttribute('os', 'not_windows')
}


const extensions ={
  navigate: function (num,err) {
    
    for (i = 0; i < document.getElementById('nav_bar').children.length; i++) {
      document.getElementById('nav_bar').children[i].classList.remove('active')
    }
    switch (num) {
      case 'all':
          for(i=0;i<document.getElementById("_content1").children.length;i++){
            document.getElementById("_content1").children[i].classList = "page_hidden";
          }
          document.getElementById("sec_all").classList = "page_showed"
          document.getElementById('navB1').classList.add('active')
          if(err==1){
            document.getElementById("sec_all").innerHTML=`
             Cannot read the plugins list.
            `
            return;
          }
          if(err==2){
            document.getElementById("sec_all").innerHTML=`
             Cannot read more times the plugin's repo.
            `
            return;
          }
          if(err==3){
            document.getElementById("sec_all").innerHTML=`
            Cannot read the package.json of the plugin's repo properly.
            `
            return;
          }
          if(document.getElementById('sec_all').innerHTML == ""){
            document.getElementById("sec_all").innerHTML=`
              <div id=loading_exts>Loading extensions...</div>
            `
            const request = require("request");
            for(const plugin of full_plugins){
              const data = plugin.git;
              request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
                const package = JSON.parse(body2);
                if(document.getElementById("loading_exts")!=undefined){
                  document.getElementById("loading_exts").remove();
                }
                const sec_ID = 'sec'+Math.random().toString();
                document.getElementById('sec_all').innerHTML +=`
                <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.owner.login}' branch='${data.default_branch}'>
                  <h3>${data.name}  </h3>
                  <p>${data.description} </p>
                  ${graviton.getPlugin(data.name)!=undefined?`<p class=installed> ${current_config.language["Installed"]} · v${graviton.getPlugin(data.name).version}</p>`:""}
                </div>
                ` 
              });
            }
          }
          
        return
      case 'installed':
          for(i=0;i<document.getElementById("_content1").children.length;i++){
            document.getElementById("_content1").children[i].classList = "page_hidden";
          }
          document.getElementById("sec_installed").classList = "page_showed"
          document.getElementById('navB2').classList.add('active')
          if(document.getElementById('sec_installed').innerHTML == ""){
            document.getElementById("sec_installed").innerHTML=`
              <div id=loading_exts2>Loading extensions...</div>
            `
            for(const data of plugins_list ){
              if(document.getElementById("loading_exts2")!=undefined){
                document.getElementById("loading_exts2").remove();
              }
              const sec_ID = 'sec'+Math.random().toString();
              document.getElementById('sec_installed').innerHTML +=`
              <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.author}' branch='${data.default_branch}'>
                <h3>${data.name}  </h3>
                <p>${data.description} </p>
                ${graviton.getPlugin(data.name)!=undefined?`<p class=installed>v${graviton.getPlugin(data.name).version}</p>`:""}
              </div>
              ` 
            };
          }
          
        return
      case 'themes':
        for(i=0;i<document.getElementById("_content1").children.length;i++){
          document.getElementById("_content1").children[i].classList = "page_hidden";
        }
        document.getElementById("sec_themes").classList = "page_showed"
        document.getElementById('navB3').classList.add('active')
        if(document.getElementById('sec_themes').innerHTML == ""){
          document.getElementById("sec_themes").innerHTML=`
              <div id=loading_exts3>Loading extensions...</div>
            `
          const request = require("request");
          for(const plugin of full_plugins){
            const data = plugin.git;
            request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
              const package = JSON.parse(body2);
              if(package.colors==undefined) return;
              if(document.getElementById("loading_exts3")!=undefined){
                document.getElementById("loading_exts3").remove();
              }
              const sec_ID = 'sec'+Math.random().toString();
              document.getElementById('sec_themes').innerHTML +=`
              <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.owner.login}' branch=${data.default_branch}>
                <h3>${data.name}  </h3>
                <p>${data.description} </p>
                ${graviton.getPlugin(data.name)!=undefined?`<p class=installed> ${current_config.language["Installed"]} · v${graviton.getPlugin(data.name).version}</p>`:""}
              </div>
              ` 
            });
          }
        }
        
      return
    }
  },
  openStore : function(callback){
    const market_window = new Window({
      id: 'market_window',
      content: `
      <div class=center>
      <div class="spinner">
       <div></div> 
      </div>
      </div>
        `
    })
    market_window.launch();
    if(full_plugins.length!=0) {
      store.loadMenus();
      return callback();
    }
    const github = require('octonode')
    const client = github.client()   
    const request = require("request");
    let extensions = []; 
    request('https://raw.githubusercontent.com/Graviton-Code-Editor/plugins_list/master/list.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        extensions = JSON.parse(body);
      }else {
        store.loadMenus();
        return callback(1);
      }
      for(i=0;i<extensions.length;i++){
        client.repo(extensions[i]).info(function(err,data){
          if(err) {
            store.loadMenus();
            return callback(2);
          }
          request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
            const package = JSON.parse(body2);
            full_plugins.push({
              git:data,
              package:package
            })
            if(err){
              store.loadMenus();
              return callback(3);
            }
            if(i==extensions.length && full_plugins.length == i){
              store.loadMenus();
              if(callback!=undefined) callback();
              
            }
          });
          
        })
        
      };
    });
    
  },
  openSubExtensions: function(data){
    const ext_win = new Window({
      id: 'sec'+data.name,
      content:`
      <button class="button1 close_exts" onclick=closeWindow('sec${data.name}') >${icons.close}</button>
      <div class=sub_extension_div id=${data.getAttribute('name')+'_div'} >
          <div class="top">
            <div>
              <h1>${data.getAttribute('name')}</h1>
              <p>${data.getAttribute('description')}</p>
              <p>${current_config.language["MadeBy"]} ${data.getAttribute('name')!=undefined?data.getAttribute('author'):"Unknown"}</p>
              <p>${current_config.language["Version"]}: ${graviton.getPlugin(data.getAttribute('name'))!=undefined?graviton.getPlugin(data.getAttribute('name')).version:"Unknown"}</p>
            </div> 
            <div>
              <div>
                <button onclick=extensions.installExtension('${data.id}') id=${Math.random()+'install'} class=button1 >${current_config.language["Install"]}</button> 
                <button onclick=extensions.uninstallExtension('${data.id}') id=${Math.random()+'uninstall'} class=button1 >${current_config.language["Uninstall"]}</button> 
              </div>
            </div> 
          </div>
        </div>
      </div>
      `
      });
      ext_win.launch();
      if(graviton.getPlugin(data.getAttribute('name'))!=undefined){
        fs.readFile(path.join(plugins_folder, data.getAttribute("name"),"readme.md"), "utf8", function(err, readme) {
          document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!err?marked(readme):getTranslation("NoReadme")}</div>`
        });
      }else{
        const request = require("request");
        request(`https://raw.githubusercontent.com/${data.getAttribute('author')}/${data.getAttribute('name')}/${data.getAttribute('branch')}/readme.md`, function (error, response, body3) {
          document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!error?marked(body3):getTranslation("NoReadme")}</div>`
        })
      }
  },
  installExtension: function(id){
    const data = document.getElementById(id);
    if (fs.existsSync(path.join(plugins_folder,data.getAttribute("name")))) {
      new Notification('Market',data.getAttribute("name")+ current_config.language["ExtAlreadyInstalled"]);
      return;
    }
    const nodegit = require("nodegit");
    nodegit.Clone(data.getAttribute("git"), path.join(plugins_folder.replace(/\\/g, '\\\\'),data.getAttribute("name"))).then(function(repository) {
      const installed_ext_event = new CustomEvent("extension_installed",{
        detail:{
          name : data.getAttribute("name")
        }
      })
      document.dispatchEvent(installed_ext_event);
      new Notification('Market',data.getAttribute("name")+ current_config.language["ExtInstalled"]);
      for(i=0;i<full_plugins.length;i++){
        if(full_plugins[i].package.name==data.getAttribute("name")){
          plugins.install(full_plugins[i].package)
        }
      }
      
    });
    
  },
  uninstallExtension: function(id){
    const data = document.getElementById(id);
    const rimraf = require('rimraf');
      const fs = require('fs');
      if (!fs.existsSync(path.join(plugins_folder,data.getAttribute("name")))) {
          new Notification('Market',data.getAttribute("name")+ current_config.language["ExtNotInstalled"]);
          return;
      }
      rimraf(path.join(plugins_folder,data.getAttribute("name")), function (err) { 
          if(err)console.log(err);   
          new Notification('Market',data.getAttribute("name") + current_config.language["ExtUninstalled"])
          const csss = document.getElementsByClassName(data.getAttribute("name")+"_css");
          for(i=0;i<csss.length;i++){
            csss[i].remove();
            i--;
          }
          for(i=0;i<plugins_list.length;i++){
            if(plugins_list[i].name==data.getAttribute("name")){
              plugins_list.splice(i,1);
              return;
            }
          }
          const uninstalled_ext_event = new CustomEvent("extension_uninstalled",{
            detail:{
              name : data.getAttribute("name")
            }
          })
          document.dispatchEvent(uninstalled_ext_event);
      });
  }
}

const store = {
  loadMenus:function(){
    graviton.windowContent("market_window",`
      <div class="g_lateral_panel">
        <h2 class="window_title window_title2 translate_word"  idT="Market">${getTranslation(current_config.language['Market'])}</h2> 
        <div id="nav_bar">
          <button id="navB1" onclick="extensions.navigate('all')" class="translate_word" idT="All">${getTranslation(current_config.language['All'])}</button>
          <button id="navB2" onclick="extensions.navigate('installed')" class="translate_word" idT="Installed">${getTranslation(current_config.language['Installed'])}</button>
          <button id="navB3" onclick="extensions.navigate('themes')" class="translate_word" idT="Themes">${getTranslation(current_config.language['Themes'])}</button>
        </div>
      </div>
      <div id="_content1">
        <div id="sec_all"></div>
        <div id="sec_installed"></div>
        <div id="sec_themes"></div>
      </div>  
      `);
  }
}
const plugins = {
  install: function(config){
    if(config.colors==undefined){
      plugins_list.push(config);
      if(config["main"]!=undefined){
        const plugin = require(path.join(plugins_folder, config["folder"], config["main"]));
      }
      if(config["css"] !=undefined) {
        for (i = 0; i < config["css"].length; i++) {
          const link = document.createElement("link");
          link.setAttribute("rel", "stylesheet");
          link.classList = config["name"]+"_css";
          link.setAttribute("href", path.join(plugins_folder, config["folder"], config["css"][i])),
          document.body.appendChild(link);
        }
      }
    }else{
      themes.push(config); //Push the theme to the array
      plugins_list.push(config);
      const newLink = document.createElement("link");
      newLink.setAttribute("rel", "stylesheet");
      newLink.setAttribute("href", path.join(highlights_folder, config["highlight"] + ".css")); //Link new themes 
      document.body.appendChild(newLink);
    }
  }
}

