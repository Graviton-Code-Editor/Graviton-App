/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
/* <-- Default NavBar >-- */
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
    'Open Folder': 'openFolder()',
    'Open File': 'openFile()',
    'Save As': 'saveFileAs()',
    'Save': {
      click: 'saveFile()',
      hint: 'Ctrl+S'
    },
    '*line': '',
    'New Project': 'g_NewProjects(); ',
    'space1': '*line',
    Exit: {
      click:'remote.app.exit(0);',
      icon:'exit'
    }
  }
})
Tools.setList({
  button: 'Tools',
  list: {
    Market:'extensions.openStore();',
    Plugins: 'openPlugins()',
    'ShowWelcome': 'g_welcomePage()',
    "1a":"*line",
    "Search":{
      click:"graviton.editorSearch();",
      hint:"Ctrl+F"
    },
    "Replace":{
      click:"graviton.editorReplace();",
      hint:"Ctrl+Shit+R"
    },
    "JumpToLine":{
      click:"graviton.editorJumpToLine();",
      hint:"Alt+G"
    },
    '2a': '*line',
    Settings: "Settings.open(); Settings.navigate('1')"
  }
})
Editor.setList({
  button: 'Editor',
  list: {
    'Zen Mode': {
      click: 'graviton.toggleZenMode()',
      hint: 'Ctrl+E'
    },
    'a1': '*line',
    'DefaultView': 'screens.default()',
    'SplitScreen': {
      click: 'screens.add()',
      icon: 'split_screen',
      hint: 'Ctrl+N'
    },
    'RemoveScreen': {
      click: 'graviton.removeScreen()',
      icon: 'remove_screen',
      hint: 'Ctrl+L'
    },
    'a2': '*line',
    'newTerminal': {
      click: 'commanders.terminal()',
      icon: 'new_terminal',
      hint:"Ctrl+T"
    },
    'closeTerminal': {
      click: 'commanders.closeTerminal()',
      icon: 'close_terminal',
      hint:"Ctrl+U"
    }
  }
})
WindowDM.setList({
  button: 'Window',
  list: {
    'Developer Tools': 'graviton.openDevTools()',
    "1a":"*line",
    "HideMenus": {
      click:"graviton.toggleMenus(); new Notification(getTranslation('Tip'),getTranslation('ToggleMenuTipMessage'))",
      hint:"Ctrl+Q"
    },
    "2a":"*line",
    "IncreaseZoom": {
      click:"graviton.setZoom(parseInt(current_config.appZoom)+3)",
      hint:"Ctrl+shift+plus",
      icon:"plus_zoom"
    },
    "DicreaseZoom":  {
      click:"graviton.setZoom(parseInt(current_config.appZoom)+-3)",
      hint:"Ctrl+minus",
      icon:"minus_zoom"
    },
    "DefaultZoom": {
      click:'graviton.setZoom(25);',
      icon:"default_zoom"
    },
    'Fullscreen':{
      click:'graviton.toggleFullScreen()',
      hint:"F11"
    } 
  }
})
Help.setList({
  button: 'Help',
  list: {
    Issues: "shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/issues')",
    'Source Code': "shell.openExternal('https://github.com/Graviton-Code-Editor')",
    'Telegram Channel': "shell.openExternal('https://t.me/gravitoneditor')",
    'Telegram Group': "shell.openExternal('https://t.me/joinchat/FgdqbBRNJjpSHPHuDRMzfQ')",
    '*line': '',
    Donate: "shell.openExternal('https://www.paypal.me/mkenzo8')",
    FAQs: "shell.openExternal('https://www.graviton.ml/faqs')",
    Changelog: 'graviton.dialogChangelog()',
    Website: "shell.openExternal('https://www.graviton.ml')",
    About: {
      click: 'graviton.dialogAbout()',
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
  openStore : function(){
    const github = require('octonode')
    const client = github.client()   

    let extensions = [
        'Graviton-Code-Editor/FluentMod'
    ];
    const market_window = new Window({
        id: 'market_window',
        content: `
          <h2 class=window_title>Market</h2> 
          <div id=ext_list>
            <p id=loading_exts>Loading extensions...</p>
          </div>
        `
    })
    market_window.launch();
    for(i=0;i<extensions.length;i++){
      client.repo(extensions[i]).info(function(err,data){
        if(err){
          document.getElementById('ext_list').innerHTML +=`
          <p>Cannot load this extension, you have probably exceeded the maxium opening times.</p>
          `  
          console.log(err);
          return;
        }
        if(document.getElementById("loading_exts")!=undefined)document.getElementById("loading_exts").remove();
        const sec_ID = 'sec'+Math.random().toString();
        document.getElementById('ext_list').innerHTML +=`
        <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}'>
          <h3>${data.name}  </h3>
          <p>${data.description} </p>
          ${graviton.getPlugin(data.name)!=undefined?`<p class=installed> Installed · v${graviton.getPlugin(data.name).version}</p>`:""}
        </div>
        ` 
      })
    };
  },
  openSubExtensions: function(data){
    const ext_win = new Window({
      id: 'sec'+data.name,
      content:`
      <div class=sub_extension_div id=${data.getAttribute('name')+'_div'} >
          <button class=button1 onclick=closeWindow('sec${data.name}') >${current_config.language["GoBack"]}</button>
          <h2>${data.getAttribute('name')}</h2>
          <p>${data.getAttribute('description')}</p>
          <p>Author: ${graviton.getPlugin(data.getAttribute('name'))!=undefined?graviton.getPlugin(data.getAttribute('name')).author:"Unknown"}</p>
          <p>Version: ${graviton.getPlugin(data.getAttribute('name'))!=undefined?graviton.getPlugin(data.getAttribute('name')).version:"Unknown"}</p>
          <button onclick=extensions.installExtension('${data.id}') id=${Math.random()+'install'} class=button1 >Install</button> 
          <button onclick=extensions.uninstallExtension('${data.id}') id=${Math.random()+'install'} class=button1 >Uninstall</button> 
      </div>`

      });
      ext_win.launch();
  },
  installExtension: function(id){
    const data = document.getElementById(id);
    if (fs.existsSync(path.join(plugins_folder,data.getAttribute("name")))) {
      new Notification('Market',data.getAttribute("name")+ current_config.language["ExtAlreadyInstalled"]);
      return;
    }
    const nodegit = require("nodegit");
    nodegit.Clone(data.getAttribute("git"), path.join(plugins_folder.replace(/\\/g, '\\\\'),data.getAttribute("name"))).then(function(repository) {
      new Notification('Market',data.getAttribute("name")+ current_config.language["ExtInstalled"]);
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
      });
  }
}