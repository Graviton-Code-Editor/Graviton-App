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
  npm_panel: true
};

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
      appendBinds(); // Creates the general key binds
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
    graviton.loadControlButtons();      //Load window's buttons (minimize, maximize & close)
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
      appendBinds(); // Creates the general key binds
    });
  }
}
/**
 * @desc Saves the current configuration to config.json
 */
graviton.saveConfiguration = function(){
  fs.writeFile(
    configDir,
    JSON.stringify({
      justInstalled: current_config.justInstalled,
      theme: current_config.theme,
      fontSizeEditor: current_config.fontSizeEditor,
      appZoom: current_config.appZoom,
      language: current_config.language.name,
      animationsPreferences: current_config.animationsPreferences,
      autoCompletionPreferences: current_config.autoCompletionPreferences,
      lineWrappingPreferences: current_config.lineWrappingPreferences,
      accentColorPreferences: current_config.accentColorPreferences,
      blurPreferences: current_config.blurPreferences,
      bouncePreferences: current_config.bouncePreferences,
      explorerPosition: current_config.explorerPosition,
      version: GravitonInfo.version,
      build: GravitonInfo.date,
      npm_panel: current_config.npm_panel
    },null,2),
    err => {
      if (err) graviton.throwError("Couldn't save the configuration file.");
    }
  );
  if (editor != undefined) editor.refresh();
};

const saveConfig = graviton.saveConfiguration; //Prevent API problems
const loadConfig = graviton.loadConfiguration; //Prevent API problems
