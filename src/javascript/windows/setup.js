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
      /**
       * @desc Open the setu`p window
       */
      languages.map((lang, index) => {
        if (navigator.language.includes(languages[index].locale)) {
          loadLanguage(languages[index].name);
        } else if (index == languages.length + 1) {
          loadLanguage(languages[0]);
        }
      });
      const setupWindow = new Window({
        id: "graviton_setup",
        content: `
          <div id="setupWindow"></div>
        `,
        fullScreen: true
      });
      setupWindow.launch();
      Setup.navigate("languages");
      graviton.deleteLog();
      if (error_showed == false) DeleteBoot();
    },
    close: function() {
      /**
       * @desc Close the setup window
       */
      closeWindow("graviton_setup");
      current_config.justInstalled = false;
      graviton.saveConfiguration();
    },
    navigate: function(page) {
      /**
       * @desc Navigate through the Setup pages
       */
      switch (page) {
        case "languages":
          document.getElementById("setupWindow").innerHTML = "";
          const languagesPage = require(path.join(
            "..",
            "components",
            "setup",
            "languages"
          ));
          puffin.render(languagesPage, document.getElementById("setupWindow"));
          break;
        case "themes":
          document.getElementById("setupWindow").innerHTML = "";
          const themesPage = require(path.join(
            "..",
            "components",
            "setup",
            "themes"
          ));
          puffin.render(themesPage, document.getElementById("setupWindow"));
          break;
        case "additional_settings":
          document.getElementById("setupWindow").innerHTML = "";
          const additionalSettingsPage = require(path.join(
            "..",
            "components",
            "setup",
            "additionalSettings"
          ));
          puffin.render(
            additionalSettingsPage,
            document.getElementById("setupWindow")
          );
          break;
        case "welcome":
          if (graviton.isProduction() !== true) {
            new Notification({
              title: "Graviton",
              content:
                "You are on developer mode. The .graviton folder is created in the parent folder of the source. Press Ctrl+shift+i or click the button to open dev tools.",
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
          document.getElementById("setupWindow").innerHTML = "";
          const welcomePage = require(path.join(
            "..",
            "components",
            "setup",
            "welcome"
          ));
          puffin.render(welcomePage, document.getElementById("setupWindow"));
          break;
      }
    }
  }
};
