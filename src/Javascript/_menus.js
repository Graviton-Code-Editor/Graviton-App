/* <-- Default NavBar >-- */
const File = new dropMenu({
  translation: true
});
const Tools = new dropMenu({
  translation: true
});
const Help = new dropMenu({
  translation: true
});

File.setList({
  button: "File",
  list: {
    "Open Folder": "openFolder()",
    "Open File": "openFile()",
    "Save As": "saveFileAs()",
    Save: "saveFile()"
  }
});
Tools.setList({
  button: "Tools",
  list: {
    Plugins: "openPlugins()",
    "Zen Mode": "zenMode(true)",
    "Developer Tools": "openDevTools()",
    Previewer: "_preview()",
    "*line": "",
    Settings: "openSettings(); goSPage('1');"
  }
});
Help.setList({
  button: "Help",
  list: {
    Issues:
      "shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/issues')",
    "Source Code":
      "shell.openExternal('https://github.com/Graviton-Code-Editor')",
    Discord: "()",
    "*line": "",
    Donate: "shell.openExternal('https://www.paypal.me/mkenzo8')",
    FAQs: "",
    About:"createAboutDialog()"
      
  }
});
function createAboutDialog(){
createDialog('about', selected_language['About'] ,selected_language['MadeBy'] +
      " Marc Espin, <br>" +
      selected_language['Version'] +
      version +
      "<br>" +
      selected_language['OS']+ 
      ": "+
      graviton.currentOS() 
      ,
      selected_language['Accept'] 
      ,null,'closeDialog(this)','')
}
function interact_dropmenu(id) {
  var dropdowns = document.getElementsByClassName("dropdown-content");

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
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (
    !(event.target.matches(".dropbtn") || event.target.matches(".icon_border"))
  ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    time_spent_graphic_counter = false;

    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.replace("show", "hide");
      }
    }
  }
};
