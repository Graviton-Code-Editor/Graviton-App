/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const tinycolor = require("tinycolor2");

if (!fs.existsSync(highlights_folder)) { //If the highlights folder doesn't exist
  fs.mkdirSync(highlights_folder)
  fs.copy(path.join(__dirname, "src", "Highlights"), highlights_folder, err => {
    if (err) return console.error(err);
  });
}

detectLanguages();
const loadTheme = number => {
  themeObject = themes[number];
  const colors = themes[number]["colors"]; //Take the colors object inside the JSON file of the selected theme
  for (i = 0; i < Object.keys(colors).length; i++) {
    if (current_config.accentColorPreferences == "system" && Object.keys(colors)[i] == "accentColor") {
      try {
        document.documentElement.style.setProperty("--accentColor", "#" + systemPreferences.getAccentColor());
        document.documentElement.style.setProperty("--accentDarkColor", tinycolor(systemPreferences.getAccentColor()).darken().toString());
        document.documentElement.style.setProperty("--accentLightColor", tinycolor(systemPreferences.getAccentColor()).brighten().toString());
        i+=2;
      } catch { //Returns an error = system is not compatible, Linux-based will probably throw that error
        new Notification("Issue", "Your system is not compatible with accent color matching.")
      }
    } else {
      if ((current_config.animationsPreferences == "desactivated" && Object.keys(colors)[i] != "scalation") || current_config.animationsPreferences == "activated") { //Prevent changing the scalation when the animations are off
        document.documentElement.style.setProperty("--" + Object.keys(colors)[i], colors[Object.keys(colors)[i]]); //Update the CSS variables   
      }
    }
  }
  for (i = 0; i < editors.length; i++) {
    if (editors[i].editor != undefined) editors[i].editor.setOption("theme", themes[number]["highlight"]); //Update highlither after applying a new theme
  }
  for(i=0;i<editor_screens.length;i++){
    if (editor_screens[i] != undefined) {
      if (editor_screens[i].terminal != undefined) {
        editor_screens[i].terminal.xterm.setOption("theme", {
          background: themeObject.colors["editor-background-color"],
          foreground: themeObject.colors["white-black"]
        })
      }
    }
  }
  current_config.theme = themes[number];
  saveConfig(); //Save the current configuration
}
const setThemeByName = name => {
  for (i = 0; i < themes.length; i++) {
    if (themes[i]["name"] == name) {
      current_config["theme"] = themes[i];
      themeObject = themes[i];
      const colors = themes[i]["colors"]; //Take the colors object inside the json file of the selected theme
      for (i = 0; i < Object.keys(colors).length; i++) {
        if (current_config.accentColorPreferences == "system" && Object.keys(colors)[i] == "accentColor") {
          try {
            document.documentElement.style.setProperty("--accentColor", "#" + systemPreferences.getAccentColor());
            document.documentElement.style.setProperty("--accentDarkColor", tinycolor(systemPreferences.getAccentColor()).darken().toString());
            document.documentElement.style.setProperty("--accentLightColor", tinycolor(systemPreferences.getAccentColor()).brighten().toString());
            i+=2;
          } catch {}
        } else {
          if ((current_config.animationsPreferences == "desactivated" && Object.keys(colors)[i] != "scalation") || current_config.animationsPreferences == "activated") { //Prevent changing the scalation when the animations are off
            document.documentElement.style.setProperty("--" + Object.keys(colors)[i], colors[Object.keys(colors)[i]]); //Update the CSS variables
          }
        }
      }
      for (i = 0; i < editors.length; i++) {
        editors[i].editor.setOption("theme", themes[i]["highlight"]); //Update highlither after applying a new theme
      }
      for(i=0;i<editor_screens.length;i++){
        if (editor_screens[i] != undefined) {
          if (editor_screens[i].terminal != undefined) {
            editor_screens[i].terminal.xterm.setOption("theme", {
              background: themeObject.colors["editor-background-color"],
              foreground: themeObject.colors["white-black"]
            })
          }
        }
      }
      return;
    }
  }
}