/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

module.exports = {
  Setup: {
    open: function() {
      languages.map((lang,index)=>{
        if(navigator.language.includes(languages[index].locale)){
          loadLanguage(languages[i].name)
        }else if(index == languages.length+1){
          loadLanguage(languages[0]); 
        }
      })
      const all = document.createElement("div");
      all.id = "graviton_setup";
      all.innerHTML = `
        <div class="body_window_full">
            <div id="body_window_full">
            </div>
        </div>`;
      document.body.appendChild(all);
      Setup.navigate("languages");
      graviton.deleteLog();
      if (error_showed == false) DeleteBoot();
    },
    close: function() {
      document.getElementById("graviton_setup").remove();
      current_config.justInstalled = false;
      saveConfig();
    },
    navigate: function(page) {
      switch (page) {
        case "languages":
          document.getElementById(
            "body_window_full"
          ).innerHTML = graviton.getTemplate("setup_languages");
          for (i = 0; i < languages.length; i++) {
            const languageDiv = document.createElement("div");
            languageDiv.setAttribute("class", "language_div");
            languageDiv.setAttribute(
              "onclick",
              `loadLanguage('${languages[i].name}'); selectLang(this);`
            );
            languageDiv.innerText = languages[i].name;
            if (languages[i].name === current_config.language.name) {
              selectLang(languageDiv);
            }
            document.getElementById("language_list").appendChild(languageDiv);
          }
          break;
        case "themes":
          document.getElementById(
            "body_window_full"
          ).innerHTML = graviton.getTemplate("setup_themes");
          break;
        case "additional_settings":
          document.getElementById(
            "body_window_full"
          ).innerHTML = graviton.getTemplate("setup_additional_settings");
          break;
        case "welcome":
          if (graviton.isProduction()===true) {
            new Notification({
              title: "Graviton",
              content:
                "You are being on dev mode. The .graviton folder is created in the parent folder of the source. Press Ctrl+shift+i or click the button to open dev tools.",
              delay: "10000",
              buttons: {
                "Dev tools": {
                  click: function() {
                    graviton.openDevTools();
                  }
                },
                Close: {}
              }
            });
          }
          document.getElementById(
            "body_window_full"
          ).innerHTML = graviton.getTemplate("setup_welcome");
          break;
      }
    }
  }
};
