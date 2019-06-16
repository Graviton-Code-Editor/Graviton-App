/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
if (!fs.existsSync(highlights_folder)) { //If the highlights folder doesn't exist
  fs.mkdirSync(highlights_folder)
  fs.copy(path.join(__dirname, "src", "Highlights"), highlights_folder, err => {
    if (err) return console.error(err);
    syncThemes();
  });
} else {
  syncThemes();
}

function syncThemes() {
  if (!fs.existsSync(themes_folder)) { //If the themes folder doesn't exist
    fs.mkdirSync(themes_folder)
    fs.copy(path.join(__dirname, "themes"), themes_folder, err => {
      if (err) throw err;
      fs.readdir(themes_folder, (err, paths) => {
        paths.forEach(dir => {
          fs.readFile(path.join(themes_folder, dir), 'utf8', function(err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            themes.push(obj); //Push the theme to the array
            const newLink = document.createElement("link");
            newLink.setAttribute("rel", "stylesheet");
            newLink.setAttribute("href", path.join(highlights_folder, obj["Highlight"] + ".css")); //Link new themes 
            document.body.appendChild(newLink);
          });
        });
      });
    });
  } else { //If the themes folder already exists
    fs.readdir(themes_folder, (err, paths) => {
      paths.forEach(dir => {
        fs.readFile(path.join(themes_folder, dir), 'utf8', function(err, data) {
          if (err) throw err;
          obj = JSON.parse(data);
          themes.push(obj); //Push the theme to the array
          const newLink = document.createElement("link");
          newLink.setAttribute("rel", "stylesheet");
          newLink.setAttribute("href", path.join(highlights_folder, obj["Highlight"] + ".css")); //Link new themes 
          document.body.appendChild(newLink);
        });
      });
    });
  }
}
detectLanguages();
const loadTheme = number => {
  themeObject = themes[number];
  const colors = themes[number]["Colors"]; //Take the colors object inside the JSON file of the selected theme
  for (i = 0; i < Object.keys(colors).length; i++) {
    if (current_config.accentColorPreferences == "system" && Object.keys(colors)[i] == "accentColor") {
      try {
        document.documentElement.style.setProperty("--accentColor", "#" + systemPreferences.getAccentColor());
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
    if (editors[i].editor != undefined) editors[i].editor.setOption("theme", themes[number]["Highlight"]); //Update highlither after applying a new theme
  }
  current_config.theme = themes[number];
  saveConfig(); //Save the current configuration
}
const setThemeByName = name => {
  for (i = 0; i < themes.length; i++) {
    if (themes[i]["Name"] == name) {
      current_config["theme"] = themes[i];
      themeObject = themes[i];
      const colors = themes[i]["Colors"]; //Take the colors object inside the json file of the selected theme
      for (i = 0; i < Object.keys(colors).length; i++) {
        if (current_config.accentColorPreferences == "system" && Object.keys(colors)[i] == "accentColor") {
          try {
            document.documentElement.style.setProperty("--accentColor", "#" + systemPreferences.getAccentColor());
          } catch {}
        } else {
          if ((current_config.animationsPreferences == "desactivated" && Object.keys(colors)[i] != "scalation") || current_config.animationsPreferences == "activated") { //Prevent changing the scalation when the animations are off
            document.documentElement.style.setProperty("--" + Object.keys(colors)[i], colors[Object.keys(colors)[i]]); //Update the CSS variables
          }
        }
      }
      for (i = 0; i < editors.length; i++) {
        editors[i].editor.setOption("theme", themes[i]["Highlight"]); //Update highlither after applying a new theme
      }
      return;
    }
  }
}