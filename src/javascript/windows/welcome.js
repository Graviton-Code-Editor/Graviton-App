/*
########################################
              MIT License
Copyright (c) 2019 Marc Espin Sanztor
License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md
#########################################
*/

"use strict";

module.exports = {
  Welcome: {
    open: function() {
        if (error_showed == false && document.body.getAttribute("loaded") !== "true") {
            DeleteBoot();
            document.body.setAttribute("loaded","true")
            const graviton_loaded = new CustomEvent("graviton_loaded", {});
            document.dispatchEvent(graviton_loaded);
        }
      /**
       * @desc Open the welcome window
       */
      if (graviton.isProduction() == true) {
        if (remote.process.argv[1] != undefined) {
          const dir = path.resolve(remote.process.argv[1]);
          Explorer.load(dir, "g_directories", true);
          if (error_showed == false) DeleteBoot();
          return;
        }
      }
      const welcomePage = require(path.join("..","components","welcome","welcome"))();
      const welcome_window = new Window({
        id:'welcome_window',
        component:welcomePage,
        height:"400px",
        width:"600px"
      })
      welcome_window.launch()
      elasticContainer.append(document.getElementById("recent_projects"))
    }
  }
};