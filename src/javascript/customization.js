/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"

const tinycolor = require("tinycolor2");

graviton.setTheme = function (name) {
  if(graviton.getCurrentTheme()==name) return;
  for (i = 0; i < themes.length; i++) {
    if (themes[i]["name"] == name) {
      if (themeObject.type == "custom_theme") {
        plugins.disableCSS(themeObject);
      }
      current_config["theme"] = themes[i].name;

      if (themes[i].type == "custom_theme") {
        plugins.enableCSS(themes[i]);
        themes[i].colors;
        themeObject = themes[i];
      }
      themeObject = themes[i];
      const colors = themes[i]["colors"]; //Take the colors object inside the json file of the selected theme
      for (i = 0; i < Object.keys(colors).length; i++) {
        if (
          current_config.accentColorPreferences == "system" &&
          Object.keys(colors)[i] == "accentColor"
        ) {
          try {
            document.documentElement.style.setProperty(
              "--accentColor",
              "#" + systemPreferences.getAccentColor()
            );
            document.documentElement.style.setProperty(
              "--accentDarkColor",
              tinycolor(systemPreferences.getAccentColor())
              .darken()
              .toString()
            );
            document.documentElement.style.setProperty(
              "--accentLightColor",
              tinycolor(systemPreferences.getAccentColor())
              .brighten()
              .toString()
            );
            i += 2;
          } catch {}
        } else {
          if (
            (current_config.animationsPreferences == "desactivated" &&
              Object.keys(colors)[i] != "scalation") ||
            current_config.animationsPreferences == "activated" ||
            Object.keys(colors)[i] != "blur"
          ) {
            //Prevent changing the scalation when the animations are off
            document.documentElement.style.setProperty(
              "--" + Object.keys(colors)[i],
              colors[Object.keys(colors)[i]]
            ); //Update the CSS variables
          }
        }
      }
      const explorer_icons = document.getElementsByClassName("explorer_file_icon");
      for (i = 0; i < explorer_icons.length; i++) {
        explorer_icons[i].src = (function () {
          if (explorer_icons[i].getAttribute("elementType") == "directory") {
            return directories.getCustomIcon(explorer_icons[i].getAttribute("file"), explorer_icons[i].parentElement.parentElement.getAttribute("opened") == "false" ? "close" : "open")
          } else {
            if (themeObject.icons == undefined || (themeObject.icons[getFormat(explorer_icons[i].getAttribute("file")).lang] == undefined && getFormat(explorer_icons[i].getAttribute("file")).trust == true)) {
              return `src/icons/files/${getFormat(
                explorer_icons[i].getAttribute("file")
              ).lang}.svg`
            } else {
              if (themeObject.icons[getFormat(explorer_icons[i].getAttribute("file")).lang] == undefined && themeObject.icons[getFormat(explorer_icons[i].getAttribute("file")).format] == undefined) {
                return `src/icons/files/${getFormat(
                  explorer_icons[i].getAttribute("file")
                ).lang}.svg`
              }
              if (getFormat(explorer_icons[i].getAttribute("file")).trust == true) {
                return path.join(plugins_folder, themeObject.name, themeObject.icons[getFormat(explorer_icons[i].getAttribute("file")).lang])
              } else {
                return path.join(plugins_folder, themeObject.name, themeObject.icons[getFormat(explorer_icons[i].getAttribute("file")).format])
              }
            }
          }


        })()
      }
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) editors[i].editor.setOption("theme", themeObject["highlight"]); //Update highlither after applying a new theme
      }
      for (i = 0; i < editor_screens.length; i++) {
        if (editor_screens[i] != undefined) {
          if (editor_screens[i].terminal != undefined) {
            editor_screens[i].terminal.xterm.setOption("theme", {
              background: themeObject.colors["editor-background-color"],
              foreground: themeObject.colors["white-black"]
            });
          }
        }
      }
      return;
    }
  }
}