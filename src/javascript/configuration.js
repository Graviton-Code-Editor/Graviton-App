/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

/**
 *
 * @desc Default (initial) configuration object
 *
 */
let current_config = {
  justInstalled: true,
  theme: "Dark",
  fontSizeEditor: "13",
  appZoom: "25",
  language: "english",
  animationsPreferences: "activated",
  autoCompletionPreferences: "desactivated",
  lineWrappingPreferences: "desactivated",
  accentColorPreferences: "manual",
  blurPreferences: "3",
  bouncePreferences: "activated",
  version: undefined,
  explorerPosition: "left",
  npm_panel: true,
  shortCuts:[
    {
      "combo":"ctrl s",
      "action":"Save File"
    },
    {
      "combo":"ctrl n",
      "action":"Split screen"
    },
    {
      "combo":"ctrl l",
      "action":"Close screen"
    },
    {
      "combo":"ctrl e",
      "action":"Zen Mode"
    },
    {
      "combo":"ctrl t",
      "action":"Open terminal"
    },
    {
      "combo":"ctrl u",
      "action":"Close terminal"
    },
    {
      "combo":"ctrl h",
      "action":"Hide terminal"
    },
    {
      "combo":"f11",
      "action":"Fullscreen"
    },
    {
      "combo":"ctrl tab",
      "action":"Menu bar"
    }
  ]
};

if(graviton.currentOS().codename === "darwin"){
  currentConfig.shortCuts = [
    {
      "combo":"cmd s",
      "action":"Save File"
    },
    {
      "combo":"cmd n",
      "action":"Split screen"
    },
    {
      "combo":"cmd l",
      "action":"Close screen"
    },
    {
      "combo":"cmd e",
      "action":"Zen Mode"
    },
    {
      "combo":"cmd t",
      "action":"Open terminal"
    },
    {
      "combo":"cmd u",
      "action":"Close terminal"
    },
    {
      "combo":"cmd h",
      "action":"Hide terminal"
    },
    {
      "combo":"f11",
      "action":"Fullscreen"
    },
    {
      "combo":"cmd tab",
      "action":"Menu bar"
    }
  ]
}

const GravitonState = new puffin.state({
  currentConfig:current_config
})

GravitonState.changed(()=>{
  console.log("what")
  graviton.saveConfiguration()
})

GravitonState.on("ConfigurationChanged",()=>{
  graviton.saveConfiguration()
})

if (!fs.existsSync(logDir)) {
  fs.writeFile(logDir, "[]");
  log = [];
} else {
  log = require(logDir);
}

/**
 * @desc Loads the configuration from the config.json for the first time
 */
graviton.loadConfiguration = function(){
  if (!fs.existsSync(configDir)) {
     fs.writeFile(configDir, JSON.stringify(current_config)); // Saves the config
    loadLanguage(current_config.language); //Loads the configured language
    graviton.refreshCustomization(); //Load basic UI configuration (zoom, font-size...)
    screens.add(); // Creates the first screen
    Menus.loadDefaults(); //Loads default top bar's menus
    Plugins.detect(function() {
      if (!current_config.justInstalled) {
        Welcome.open();
      } else {
        Setup.open();
      }
    });
  } else {
    const localConfig = require(configDir);
    Object.keys(current_config).forEach(function(key) {
      if (localConfig[key] != undefined && current_config[key] != undefined) {
        current_config[key] = localConfig[key];
      } // Will only update the extisting parameters
    });
    loadLanguage(current_config.language); //Loads the configured language
    graviton.setTitle(`v${GravitonInfo.version}`); //Initial window's title
    graviton.refreshCustomization(); //Load basic UI configuration (zoom, font-size...)
    graviton.changeExplorerPosition(current_config.explorerPosition); //Set explorer's configured position
    screens.add();  //Create first screen
    Menus.loadDefaults(); //Loads default top bar's menus
    Plugins.detect(function() {
      if (current_config.theme != undefined) {
        graviton.setTheme(current_config.theme);
      }
      if (!current_config.justInstalled) {
        Welcome.open();
      } else {
        Setup.open();
      }
      if (current_config.animationsPreferences == "desactivated") {
        const style = document.createElement("style");
        style.innerText = `
          *{
            -webkit-transition: none !important;
            transition: none !important;
            animation:0;
          }`;
        style.id = "_ANIMATIONS";
        document.documentElement.appendChild(style);
        document.documentElement.style.setProperty("--scalation", "1");
      }
    });
  }
}
document.addEventListener("graviton_loaded",function(){
  graviton.loadKeyShortcuts()
  graviton.loadControlButtons();   //Load window's buttons (minimize, maximize & close)
  
  /**
   * @desc Creates HTML project service
   */ 
  projectServices.push({
    name: "HTML",
    description: "Basic HTML project",
    onclick: () => createNewProject("html")
  });

  /**
   * @desc Creates explorer panel instance
   */ 
  EXPLORER_PANEL = new Panel({
    minHeight: "",
    content: `
      <div style="height:100%;">
        <span id="openFolder" height="24px" width="24px" onclick="openFolder()"></span>
      </div>
    `
  });

  /**
   * @desc Language  indicator and Line/Char counter Controls
   */
  document.addEventListener("screen_loaded", e => {
    const screen = e.detail.screen;
    function refreshStats(id = current_screen.id) {
      if (id != screen) return;
      langController.setText(graviton.getLanguage());
      langController.setHint(`Current: ${graviton.getLanguage()}`);
      if (editor == undefined) {
        counter.hide();
        return;
      }
      if (graviton.getCurrentTab().getAttribute("typeeditor") === "free") {
        langController.hide();
      }
      counter.show();
      langController.show();
      counter.setText(
        editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1)
      );
      counter.setHint(
        `Line ${editor.getCursor().line + 1} , Char ${Number(
          editor.getCursor().ch + 1
        )}`
      );
      editor.on("cursorActivity", function(a) {
        counter.setText(
          editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1)
        );
        counter.setHint(
          `Line ${editor.getCursor().line + 1} , Char ${Number(
            editor.getCursor().ch + 1
          )}`
        );
        counter.show();
      });
    }
    let langController = new Control({
      text: graviton.getLanguage(),
      hint: `Current: ${graviton.getLanguage()}`
    });
    if (editor != undefined) {
      var counter = new Control({
        text:
          editor.getCursor().line + 1 + "/" + Number(editor.getCursor().ch + 1),
        hint: `Line ${editor.getCursor().line + 1} , Char ${Number(
          editor.getCursor().ch + 1
        )}`
      });
      refreshStats();
    } else {
      var counter = new Control({
        text: ""
      });
      counter.hide();
      refreshStats();
    }
    document.addEventListener("tab_loaded", e => {
      refreshStats(e.detail.screen);
    });
    document.addEventListener("tab_closed", e => {
      refreshStats(e.detail.screen);
    });
    document.addEventListener("tab_created", () => {
      refreshStats();
    });
  });

  /**
   * @desc Close dropmenus when clicking out of them
   */

  window.onclick = function(event) {
    if (
      !(event.target.matches(".dropbtn") || event.target.matches(".icon_border"))
    ) {
      graviton.closeDropmenus();
    }
    if (!event.target.matches(".option")) {
      document.getElementById("context").parentElement.style = "display:none";
    }
    if (!event.target.matches("#context_menu")) {
      if (document.getElementById("context_menu") != undefined) {
        document.getElementById("context_menu").remove();
      }
    }
  };

  /**
   * @desc Creates the resizer between the explorer panel and the editors
   */
  (function(){
    const element = document.getElementById("editor_resizer");
    element.addEventListener("mousedown", initialiseResize, false);

    function initialiseResize(e) {
      window.addEventListener("mousemove", startResizing, false);
      window.addEventListener("mouseup", stopResizing, false);
    }

    function startResizing(e) {
      const explorer = document.getElementById("explorer_app");
      const content_app = document.getElementById("content_app");
      if (current_config.explorerPosition === "left") {
        explorer.style = `width: ${e.clientX - 3}px`;
      } else {
        explorer.style = `width: ${content_app.clientWidth - e.clientX}px`;
      }
      for (i = 0; i < editors.length; i++) {
        editors[i].object.blur();
      }
      graviton.resizeTerminals();
    }
    function stopResizing(e) {
      window.removeEventListener("mousemove", startResizing, false);
      window.removeEventListener("mouseup", stopResizing, false);
    }
  })()
   /**
   * @desc Force the terminal resizing when resizing the window
   */
  window.onresize = function() {
    graviton.resizeTerminals();
  };
})
/**
 * @desc Saves the current configuration to config.json
 */
graviton.saveConfiguration = function(){
  fs.writeFile(
    configDir,
    JSON.stringify({
      justInstalled: GravitonState.data.currentConfig.justInstalled,
      theme: GravitonState.data.currentConfig.theme,
      fontSizeEditor: GravitonState.data.currentConfig.fontSizeEditor,
      appZoom: GravitonState.data.currentConfig.appZoom,
      language: GravitonState.data.currentConfig.language.name,
      animationsPreferences: GravitonState.data.currentConfig.animationsPreferences,
      autoCompletionPreferences: GravitonState.data.currentConfig.autoCompletionPreferences,
      lineWrappingPreferences: GravitonState.data.currentConfig.lineWrappingPreferences,
      accentColorPreferences: GravitonState.data.currentConfig.accentColorPreferences,
      blurPreferences: GravitonState.data.currentConfig.blurPreferences,
      bouncePreferences: GravitonState.data.currentConfig.bouncePreferences,
      explorerPosition: GravitonState.data.currentConfig.explorerPosition,
      version: GravitonInfo.version,
      build: GravitonInfo.date,
      npm_panel: GravitonState.data.currentConfig.npm_panel,
      shortCuts:GravitonState.data.currentConfig.shortCuts
    },null,2),
    err => {
      if (err) graviton.throwError("Couldn't save the configuration file.");
    }
  );
  if (editor != undefined) editor.refresh();
};

const saveConfig = graviton.saveConfiguration; //Prevent API problems
const loadConfig = graviton.loadConfiguration; //Prevent API problems
