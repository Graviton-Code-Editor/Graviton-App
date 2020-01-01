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
      "combo":"ctrl shift tab",
      "action":"Menu bar"
    },
    {
      "combo":"ctrl p",
      "action":"Commander"
    },
    {
      "combo":"esc",
      "action":"Close all windows"
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
      "combo":"cmd shift tab",
      "action":"Menu bar"
    },
    {
      "combo":"ctrl p",
      "action":"Commander"
    },
    {
      "combo":"esc",
      "action":"Close all windows"
    }
  ]
}

const GravitonState = new puffin.state({
  currentConfig:current_config
})

GravitonState.changed(()=>{
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
      if (localConfig[key] != undefined && current_config[key] != undefined && key != "shortCuts") {
        current_config[key] = localConfig[key];
      } else if(key == "shortCuts"){
        if(localConfig.shortCuts == undefined) localConfig.shortCuts = current_config.shortCuts
        localConfig.shortCuts = localConfig.shortCuts.filter(a=>Boolean(a))
        current_config.shortCuts.forEach(function(bind){
          bind.combo = localConfig.shortCuts.filter(function(bd){
            return bd.action == bind.action
          })[0].combo
        })
      }
    });
    loadLanguage(current_config.language); //Loads the configured language
    graviton.setTitle(`Any folder opened`); //Initial window's title
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
  graviton.loadControlButtons();   //Load window's buttons (minimize, maximize & close)
  
  /**
   * @desc Creates HTML project service
   */ 
  projectServices.push({
    name: "HTML",
    description: "Basic HTML project",
    onclick: () => {
      graviton.newProject("html").then(function(projectDir){
        fs.writeFile(
          path.join(projectDir, "index.html"),
          projectTemplates.html,
          err => {
            if (err) {
              return err
            }
            Explorer.load(projectDir, "g_directories", true)
          }
        )
      })
    }
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
      langController.setHint(`Current language: ${graviton.getLanguage()}`);
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
        graviton.getCurrentEditor().execute("getCursor").line + 1 + "/" + Number(graviton.getCurrentEditor().execute("getCursor").column + 1)
      );
      counter.setHint(
        `Line ${graviton.getCurrentEditor().execute("getCursor").line + 1} , Char ${Number(
          graviton.getCurrentEditor().execute("getCursor").column + 1
        )}`
      );
      graviton.getCurrentEditor().execute("cursorActivity", function(a) {
        counter.setText(
          graviton.getCurrentEditor().execute("getCursor").line + 1 + "/" + Number(graviton.getCurrentEditor().execute("getCursor").column + 1)
        );
        counter.setHint(
          `Line ${graviton.getCurrentEditor().execute("getCursor").line + 1} , Char ${Number(
            graviton.getCurrentEditor().execute("getCursor").column + 1
          )}`
        );
        counter.show();
      });
    }
    let langController = new Control({
      text: graviton.getLanguage(),
      hint: `Current: ${graviton.getLanguage()}`
    });
    if (graviton.getCurrentEditorInstance() != undefined) {
      var counter = new Control({
        text:
          graviton.getCurrentEditor().execute("getCursor").line + 1 + "/" + Number(graviton.getCurrentEditor().execute("getCursor").column + 1),
        hint: `Line ${graviton.getCurrentEditor().execute("getCursor").line + 1} , Char ${Number(
          graviton.getCurrentEditor().execute("getCursor").column + 1
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
    if(graviton.isEditorAvailable()){
      graviton.getCurrentEditor().execute("onCursorActivity",()=>{
        refreshStats()
      })
    }
    document.addEventListener("tab_loaded", e => {
      refreshStats(e.detail.screen);
    });
    document.addEventListener("tab_closed", e => {
      refreshStats(e.detail.screen);
    });
    document.addEventListener("tab_created", () => {
      if(graviton.isEditorAvailable()){
        graviton.getCurrentEditor().execute("onCursorActivity",()=>{
          refreshStats()
        })
      }
      refreshStats()
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
        editors[i].execute("doBlur");
        editors[i].execute('forceRefresh')  
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
  GravitonCommander = new CommandLauncher({
    options:[
      {
        name:"Open settings",
        action:function(){
          Settings.open("customization")
        }
      },{
        name:"Open Market",
        action:function(){
          Market.open("all")
        }
      },{
        name:"Open Welcome",
        action:function(){
          Welcome.open()
        }
      },{
        name:"New Project",
        action:function(){
          Welcome.open("NewProject")
        }
      },{
        name:"Open About",
        action:function(){
          graviton.dialogAbout()
        }
      },{
        name:"Go to line",
        action:function(){
          const goToLine = new CommandLauncher({
            options:[],
            showAnimation:false,
            closeOnEnter:false,
            inputType:"number",
            onEnter(lineNumber){
              if(editor != null){
                if(lineNumber < 0){
                  graviton.getCurrentEditor().execute("goToLine",{line:0, char:0})
                }else if(lineNumber > graviton.getCurrentEditor().execute("getLineCount")){
                  graviton.getCurrentEditor().execute("goToLine",{line:Number(lineNumber > graviton.getCurrentEditor().execute("getLineCount")-1), char:0}, 300)
                }else{
                  graviton.getCurrentEditor().execute("goToLine",{line:Number(lineNumber-1), char:0}, 300)
                }
              }
            },
            onWriting(lineNumber){
              if(editor != null ){
                if(lineNumber < 0){
                  graviton.getCurrentEditor().execute("goToLine",{line:0, char:0}, 300)
                }else if(lineNumber > graviton.getCurrentEditor().execute("getLineCount")){
                  graviton.getCurrentEditor().execute("goToLine",{line:Number(lineNumber > graviton.getCurrentEditor().execute("getLineCount"))-1, char:0}, 300)
                }else{
                  graviton.getCurrentEditor().execute("goToLine",{line:Number(lineNumber-1), char:0}, 300)
                }
              }
            }
          })
          goToLine.open()
        }
      },
      {
        name:"Set theme",
        action:function(){
          const listThemes = themes.map((theme)=>{
            return {
              name:theme.name,
              action:function(){
                graviton.setTheme(theme.name);
                graviton.saveConfiguration()
              }
            }
          })
          const ThemesCommander = new CommandLauncher({
            options:listThemes,
            showAnimation:false,
            closeOnEnter:false
          })
          ThemesCommander.open()
        }
      }
    ]
  })
  graviton.loadKeyShortcuts()
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
  if(graviton.isEditorAvailable()){
    graviton.getCurrentEditor().execute("forceRefresh")
  }
};

const saveConfig = graviton.saveConfiguration; //Prevent API problems
const loadConfig = graviton.loadConfiguration; //Prevent API problems
