/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

module.exports = {
  Settings: {
    open: function() {
      const settings_window = new Window({
        id: "settings_window",
        content: graviton.getTemplate("settings_sidemenu"),
        onClose: "graviton.saveConfiguration();"
      });
      settings_window.launch();
      elasticContainer.append(document.getElementById("settings_content"));
    },
    navigate: function(num) {
      switch (num) {
        case "customization":
          document.getElementById(
            "settings.customization"
          ).innerHTML = graviton.getTemplate("settings_customization");
          if (document.getElementById("theme_list") != null) {
            themes.forEach(theme => {
              const themeDiv = document.createElement("div");
              themeDiv.setAttribute("class", "theme_div");
              themeDiv.setAttribute(
                "onclick",
                `graviton.setTheme('${theme.name}'); selectionFromTo(this.parentElement,this); graviton.saveConfiguration();`
              );
              themeDiv.innerHTML = `
                <p style="margin:0px 0; font-size:17px;">${sanitize(theme.name)}</p>
                  <p style="font-size:14px; margin:12px 0px;">${getTranslation(
                    "MadeBy"
                  ) + sanitize(theme.author)}</p>
                  <p style="font-size:13px; margin:12px 0px;">${
                    sanitize(theme.description)
                  }</p>
                  <div class="accent" style="background:${
                    theme.colors["accentColor"]
                      };"></div>
              `;
              if (theme.name === current_config.theme) {
                selectionFromTo(document.getElementById("theme_list"), themeDiv);
              }
              document.getElementById("theme_list").appendChild(themeDiv);
              elasticContainer.append(
                document.getElementById("theme_list"),
                "horizontal"
              );
            });
            if (themes.length == 0) {
              document.getElementById("theme_list").innerHTML = `
              <span style="font-size:14px">No themes are installed. Go <span class="link" onclick="closeWindow('settings_window');Market.open(function(){Market.navigate('all')})" >Market</span> and explore ! <img draggable="false" class="emoji-medium" src="src/openemoji/1F9D0.svg"> </span>
              `;
            }
          }
          break;
        case "languages":
          document.getElementById(
            "settings.languages"
          ).innerHTML = graviton.getTemplate("settings_languages");
          if (document.getElementById("language_list") != null) {
            languages.forEach(lang => {
              const languageDiv = document.createElement("div");
              languageDiv.setAttribute("class", "language_div");
              languageDiv.setAttribute(
                "onclick",
                `loadLanguage('${lang.name}'); selectionFromTo(this.parentElement,this); graviton.saveConfiguration();`
              );
              languageDiv.innerText = lang.name;
              if (lang.name === current_config.language.name) {
                selectionFromTo(document.getElementById("language_list"),languageDiv);
              }
              document.getElementById("language_list").appendChild(languageDiv);
            });
          }
          break;
        case "editor":
          document.getElementById(
            "settings.editor"
          ).innerHTML = graviton.getTemplate("settings_editor");
          break;
        case "advanced":
          document.getElementById(
            "settings.advanced"
          ).innerHTML = graviton.getTemplate("settings_advanced");
          break;
        case "about":
          document.getElementById(
            "settings.about"
          ).innerHTML = graviton.getTemplate("settings_about");
          if (new_update != false) {
            if (document.getElementById("about_section") != null) {
              document.getElementById("about_section").innerHTML += `
              <p style="color:var(--accentColor);">New update is live! - ${
                new_update[GravitonInfo.state]["version"]
              }</p>
              `;
            }
          }
          break;
      }
    },
    refresh: () => {
      current_config.appZoom = document.getElementById("slider_zoom").value;
      webFrame.setZoomFactor(current_config.appZoom / 25);
      current_config.blurPreferences = document.getElementById(
        "slider_blur"
      ).value;
      if (current_config.blurPreferences != 0) {
        document.documentElement.style.setProperty(
          "--blur",
          `${current_config.blurPreferences}px`
        );
      } else {
        document.documentElement.style.setProperty("--blur", `none`);
      }
      graviton.saveConfiguration();
    },
    addNewSection({ name, content }) {
      const html_simulation = document.createElement("div");
      html_simulation.innerHTML = templates.settings_sidemenu;
      html_simulation.children[0].children[0].innerHTML += `
      <gv-navbutton href="${name}" >${name}</gv-navbutton>
      `;
      html_simulation.children[0].children[1].innerHTML += `
      <gv-navpage id="settings.${name}" href="${name}">${content}</gv-navpage>
      `;
      templates.settings_sidemenu = html_simulation.innerHTML;
      const eventEmitter = new EventEmitter();
      pagesEvents.push({
        name:name,
        emitter:eventEmitter
      })
      return eventEmitter;
    }
  }
};
