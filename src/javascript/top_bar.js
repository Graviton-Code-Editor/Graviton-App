/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
/* <-- Default NavBar >-- */
let anyDropON = null;
const File = new dropMenu({
  id:"file",
  translation: true
});
const Tools = new dropMenu({
  if:"tools",
  translation: true
});
const Editor = new dropMenu({
  id:"editor",
  translation: true
});
const Help = new dropMenu({
  id:"help",
  translation: true
});
File.setList({
  button: "File",
  list: {
    "Open Folder": "openFolder()",
    "Open File": "openFile()",
    "Save As": "saveFileAs()",
    Save: "saveFile()",
    "*line": "",
    "New Project":"g_NewProjects(); "
  }
});
Tools.setList({
  button: "Tools",
  list: {
    Plugins: "openPlugins()",
    "ShowWelcome":"g_welcomePage()",
    "Zen Mode": "g_ZenMode(true)",
    "Developer Tools": "graviton.openDevTools()",
    Previewer: "g_preview()",
    "*line": "",
    Settings: "openSettings(); goSPage('1');"
  }
});
Editor.setList({
  button: "Editor",
  list: {
    "DefaultView":"screens.default()",
    "SplitScreen":{
      click:"screens.add()",
      icon:"split_screen"
    },
    "RemoveScreen":{
      click:"graviton.removeScreen()",
      icon:"remove_screen"
    }
  }
});
Help.setList({
  button: "Help",
  list: {
    Issues:"shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/issues')",
    "Source Code":"shell.openExternal('https://github.com/Graviton-Code-Editor')",
    "Telegram Channel": "shell.openExternal('https://t.me/gravitoneditor')",
    "Telegram Group": "shell.openExternal('https://t.me/joinchat/FgdqbBRNJjpSHPHuDRMzfQ')",
    "*line": "",
    Donate: "shell.openExternal('https://www.paypal.me/mkenzo8')",
    FAQs: "",
    Changelog:"graviton.dialogChangelog()",
    Website:"shell.openExternal('https://www.graviton.ml')",
    About:{
      click:"graviton.dialogAbout()",
      icon:"info"
    }
  }
});

function interact_dropmenu(id) {
  const dropdowns = document.getElementsByClassName("dropdown-content");
  for (i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].id != id) {
      dropdowns[i].classList.replace("show", "hide"); //Close the other menus
    } else {
      if (dropdowns[i].classList.contains("show")) {
        dropdowns[i].classList.replace("show", "hide"); //Hide the clicked menu
        anyDropON = null;
      } else {
        dropdowns[i].classList.replace("hide", "show"); //Show the clicked menu
        anyDropON = id;
      }
    }
  }
}
// Close all dropdowns if the user clicks outside
window.onclick = function(event) {
  if (!(event.target.matches(".dropbtn") || event.target.matches(".icon_border"))) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    time_spent_graphic_counter = false;
    for (i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.replace("show", "hide");
        anyDropON = null;
      }
    }
  }
};

const windows_buttons = `
     <button onclick="g_window.minimize(); " id="minimize" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><rect x="7" y="11.5" width="10" height="0.9" transform="matrix(1,0,0,1,0,0)" fill="var(--titleBar-icons-color)"/></svg></button>
     <button onclick="g_window.maximize(); " id="maximize" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 24 24" width="24" height="24"><rect x="7.5" y="7.5" width="9" height="9" transform="matrix(1,0,0,1,0,0)" fill="transparent" vector-effect="non-scaling-stroke" stroke-width="1" stroke="var(--titleBar-icons-color)" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg></button>
     <button onclick="g_window.close();" id="close" style=" height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="20" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)" fill="var(--titleBar-icons-color)" /><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" fill="var(--titleBar-icons-color)" /></svg></button>
     `;
if(graviton.currentOS()=="win32"){
     document.getElementById("controls").innerHTML = windows_buttons;
}else{
     document.getElementById("controls").innerHTML = " ";
     document.getElementById("controls").setAttribute("os","unix_based");
}

  g_window.on('maximize', (e, cmd) => {
    document.getElementById("maximize").setAttribute("onclick","g_window.unmaximize();");
})
  g_window.on('unmaximize', (e, cmd) => {
    document.getElementById("maximize").setAttribute("onclick","g_window.maximize();");
