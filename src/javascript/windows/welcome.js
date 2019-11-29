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
      const welcome_window = new Window({
        id:'welcome_window',
        content:graviton.getTemplate("welcome"),
        height:"400px",
        width:"600px"
    })
    welcome_window.launch()
    //elasticContainer.append(document.getElementById("recent_projects"))
    if (error_showed == false) {
      DeleteBoot();
      const graviton_loaded = new CustomEvent("graviton_loaded", {});
      document.dispatchEvent(graviton_loaded);
    }
    }
  }
};
