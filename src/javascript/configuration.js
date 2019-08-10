/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

/*

  * Preload some images so they are stored in the cache, this is made to improve the UX.

*/
preload([
  
  "src/icons/folder_opened.svg",
  "src/icons/custom_icons/git.svg",
  "src/icons/custom_icons/node_modules.svg"
]);

/*

  * Default (initial) config object

*/
let current_config = {
  justInstalled: true,
  theme: 'Dark',
  fontSizeEditor: '13',
  appZoom: '25',
  language: 'english',
  animationsPreferences: 'activated',
  autoCompletionPreferences: 'desactivated',
  lineWrappingPreferences: 'desactivated',
  accentColorPreferences: 'manual',
  blurPreferences: '3',
  bouncePreferences:'activated',
  miniMapPreferences:'desactivated',
  version: undefined
};

function loadConfig() {
  // Loads the configuration from the config.json for the first time
  if (!fs.existsSync(configDir)) {
    fs.writeFile(configDir, JSON.stringify(current_config)); // Save the config
    updateSettings();
    loadLanguage(current_config.language);
    screens.add(); //Creates the first screen
    detectPlugins(function() {
      if (current_config.justInstalled === false) {
        openWelcome();
      } else {
        Setup.open();
      }
      appendBinds(); //Creates the general key binds
    });
  } else {
    const local_config = require(configDir);
    Object.keys(current_config).forEach(function(key, index) {
      if (local_config[key] != undefined)
        current_config[key] = local_config[key]; // Will only change the extisting parameters
    });
    updateSettings();
    screens.add(); //Creates the first screen
    detectPlugins(function() {
      if (current_config["theme"] != undefined)
        graviton.setTheme(current_config["theme"]);
        loadLanguage(current_config.language);
      if (current_config.justInstalled === false) {
        openWelcome();
      } else {
        Setup.open();
      }
      if (current_config.animationsPreferences == "desactivated") {
        const style = document.createElement("style");
        style.innerText = `*{-webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        transition: none !important;
        animation:0;}`;
        style.id = "_ANIMATIONS";
        document.documentElement.appendChild(style);
        document.documentElement.style.setProperty("--scalation", "1");
      }
      appendBinds(); //Creates the general key binds
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
    language: current_config["language"]["g_l"],
    animationsPreferences: current_config.animationsPreferences,
    autoCompletionPreferences: current_config.autoCompletionPreferences,
    lineWrappingPreferences: current_config.lineWrappingPreferences,
    accentColorPreferences: current_config.accentColorPreferences,
    blurPreferences: current_config.blurPreferences,
    bouncePreferences: current_config.bouncePreferences,
    miniMapPreferences:current_config.miniMapPreferences,
    version: g_version.version,
    build: g_version.date
  };
  newConfig = JSON.stringify(newConfig);
  fs.writeFile(configDir, newConfig, err => {});
  if (editor != undefined) editor.refresh();
}
