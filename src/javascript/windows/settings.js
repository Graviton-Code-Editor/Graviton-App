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
      const sidePanel = require(path.join("..","components","settings","sidepanel"));
      const settings_window = new Window({
        id: "settings_window",
        component:sidePanel,
        onClose: "graviton.saveConfiguration();"
      });
      settings_window.launch();
      elasticContainer.append(document.getElementById("settings_content"));
    },
    navigate: function(num) {
      const {puffin } = require("@mkenzo_8/puffin")
      switch (num) {
        case "customization":
          document.getElementById("settings.customization").innerHTML = "";
          const customizationSection = require(path.join("..","components","settings","customization"));

          puffin.render(customizationSection,document.getElementById("settings.customization"))
          if (document.getElementById("theme_list") != null) { 
            if (themes.length == 0) {
              document.getElementById("theme_list").innerHTML = `
              <span style="font-size:14px">No themes are installed. Go <span class="link" onclick="closeWindow('settings_window');Market.open(function(){Market.navigate('all')})" >Market</span> and explore ! <img draggable="false" class="emoji-medium" src="src/openemoji/1F9D0.svg"> </span>
              `;
            }else{
              selectionFromTo(document.getElementById("theme_list"),document.getElementById("theme_card_"+themeObject.name))
            }
          }
          break;
        case "languages":
          document.getElementById("settings.languages").innerHTML = ""
          const languagesSection = require(path.join("..","components","settings","languages"));
          puffin.render(languagesSection,document.getElementById("settings.languages"))
          break;
        case "editor":
          document.getElementById("settings.editor").innerHTML = ""
          const editorSection = require(path.join("..","components","settings","editor"));
          puffin.render(editorSection,document.getElementById("settings.editor"))
          break;
        case "advanced":
          document.getElementById("settings.advanced").innerHTML = ""
          const advancedSection = require(path.join("..","components","settings","advanced"));
          puffin.render(advancedSection,document.getElementById("settings.advanced"))
          break;
        case "about":
            document.getElementById("settings.advanced").innerHTML = ""
          document.getElementById("settings.about").innerHTML = ""
          const about_section = require(path.join("..","components","settings","about"));
          puffin.render(about_section,document.getElementById("settings.about"))
          if (graviton.updateAvailable() != false) {
            if (document.getElementById("about_section") != null) {
              document.getElementById("about_section").innerHTML += `
              <p style="color:var(--accentColor);">New update is live! - ${
                graviton.updateAvailable()[GravitonInfo.state]["version"]
              }</p>
              `;
            }
          }
          break;
      }
    },
    refresh: function(){
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
