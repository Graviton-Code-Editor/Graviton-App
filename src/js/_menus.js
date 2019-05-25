/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
/* <-- Default NavBar >-- */
const File = new dropMenu({
  id:"file",
  translation: true
});
const Tools = new dropMenu({
  if:"tools",
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
    "New Project":"g_openNewProjects(); g_NPgoPage('1')"
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
    About:"graviton.dialogAbout()"
  }
});
function interact_dropmenu(id) {
  const dropdowns = document.getElementsByClassName("dropdown-content");
  for (i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].id != id) {
      dropdowns[i].classList.replace("show", "hide"); //Close the other menus
    } else {
      if (dropdowns[i].classList.contains("show")) {
        dropdowns[i].classList.replace("show", "hide"); //If clicked menu is opened
      } else {
        dropdowns[i].classList.replace("hide", "show"); //If clicked menu is closed
        if (id == "graphic") {
          loadGraphic();
        }
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
      }
    }
  }
};