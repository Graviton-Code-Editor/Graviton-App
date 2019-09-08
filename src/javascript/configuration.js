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
 *@desc Default (initial) configuration object
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
  explorerPosition: "left"
};

if (!fs.existsSync(logDir)) {
  fs.writeFile(logDir, "[]");
  log = [];
} else {
  log = require(logDir);
}

function loadConfig() {
  // Loads the configuration from the config.json for the first time
  if (!fs.existsSync(configDir)) {
    fs.writeFile(configDir, JSON.stringify(current_config)); // Save the config
    loadLanguage(current_config.language);
    graviton.refreshCustomization();
    screens.add(); // Creates the first screen
    Menus.loadDefaults();
    Plugins.detect(function() {
      if (!current_config.justInstalled) {
        Welcome.open();
      } else {
        Setup.open();
      }
      appendBinds(); // Creates the general key binds
    });
  } else {
    const local_config = require(configDir);
    Object.keys(current_config).forEach(function(key, index) {
      if (local_config[key] != undefined && current_config[key] != undefined) {
        current_config[key] = local_config[key];
      } // Will only change the extisting parameters
    });
    loadLanguage(current_config.language);
    graviton.refreshCustomization();
    graviton.changeExplorerPosition(current_config.explorerPosition);
    Menus.loadDefaults();
    screens.add(); // Creates the first screen
    Plugins.detect(function() {
      if (current_config["theme"] != undefined) {
        graviton.setTheme(current_config["theme"]);
      }
      if (!current_config.justInstalled) {
        Welcome.open();
      } else {
        Setup.open();
      }
      if (current_config.animationsPreferences == "desactivated") {
        const style = document.createElement("style");
        style.innerText = `*{-webkit-transition: none !important;
               transition: none !important;
               animation:0;}`;
        style.id = "_ANIMATIONS";
        document.documentElement.appendChild(style);
        document.documentElement.style.setProperty("--scalation", "1");
      }
      appendBinds(); // Creates the general key binds
    });
  }
}

function saveConfig() {
  // Saves the current configuration to config.json
  let newConfig = {
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
    build: GravitonInfo.date
  };
  newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, err => {});
  if (editor != undefined) editor.refresh();
}
